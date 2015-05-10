'use strict';

var fs = require('fs');
var console = require('console');

var JsigAST = require('../../ast.js');
var FileMeta = require('./file.js');
var isModuleExports = require('../../lib/is-module-exports.js');
var parser = require('../../parser.js');
var findJsigUri = require('../../lib/find-jsig-uri.js');
var getJsigIdentifier =
    require('../../lib/get-jsig-identifier.js');
var findByJsigIdentifier =
    require('../../lib/find-by-jsig-identifier.js');

var requireType = JsigAST.functionType({
    args: [JsigAST.literal('String')],
    result: JsigAST.literal('Any')
});
requireType.isNodeRequireToken = true;

var moduleType = JsigAST.object({
    exports: JsigAST.literal('Any')
});
moduleType.isNodeModuleToken = true;

module.exports = ProgramMeta;

/*  ProgramMeta is threaded through every verifier which
    verifies that an AST node is type sound.

    This is a place to put meta data about the state of the
    program so that each node in the AST can access it.

    currently it is

    {
        type: 'program'
        ast: EsprimaASTNodeForFile,
        filename: filenameOfAst,
        jsigUri: stringUriToJsigFile,
        jsigAst: jsigAstForFile,

        moduleExportsNode: EsprimaASTNode,
        moduleExportsType: JsigASTNode,

        currentMeta: Meta
    }

    We prepopulate meta with known identifiers and their types
*/
function ProgramMeta(ast, filename) {
    if (!(this instanceof ProgramMeta)) {
        return new ProgramMeta(ast, filename);
    }

    this.ast = ast;
    this.filename = filename;
    this.identifiers = {};
    this.jsigUri = null;
    this.jsigAst = null;
    this.type = 'program';

    this.moduleExportsNode = null;
    this.moduleExportsType = null;

    this.currentMeta = new FileMeta(this);

    this.currentMeta.identifiers.require = {
        type: 'variable',
        jsig: requireType
    };
    this.currentMeta.identifiers.module = {
        type: 'variable',
        jsig: moduleType
    };
}

ProgramMeta.prototype.setModuleExportsNode =
function setModuleExportsNode(astNode) {
    var moduleExports = astNode.body.filter(isModuleExports)[0];
    if (moduleExports) {
        var right = moduleExports.expression.right;
        this.moduleExportsNode = right;
    }
};

ProgramMeta.prototype.loadJsigDefinition =
function loadJsigDefinition(callback) {
    var self = this;

    findJsigUri(self.filename, onJsig);

    function onJsig(err, jsigUri) {
        if (err) {
            return callback(err);
        }

        if (jsigUri) {
            self.jsigUri = jsigUri;
            fs.readFile(jsigUri, 'utf8', onfile);
        } else {
            handleBody();
        }

        function onfile(err2, content) {
            if (err2) {
                return callback(err2);
            }

            parser(content, handleBody);
        }
    }

    function handleBody(err, jsigAst) {
        if (err) {
            return callback(err);
        }

        if (jsigAst) {
            self.storeAndExpand(jsigAst);
        }

        callback(null);
    }
};

ProgramMeta.prototype.storeAndExpand =
function storeAndExpand(jsigAst) {
    var self = this;

    self.jsigAst = jsigAst;
    var identifier = getJsigIdentifier(
        self.jsigUri, self.filename
    );

    if (!identifier) {
        return;
    }

    var jsigType = findByJsigIdentifier(jsigAst, identifier);
    if (!jsigType) {
        return;
    }

    if (!self.moduleExportsNode) {
        console.warn('got a type for file', self.filename,
            'but got no module.exports');
        return;
    }

    self.moduleExportsType = jsigType.typeExpression;
    self.currentMeta.identifiers.module = {
        type: 'variable',
        jsig: JsigAST.object({
            exports: jsigType.typeExpression
        })
    };

    var node = self.moduleExportsNode;

    if (node.type === 'Identifier') {
        self.currentMeta.addVar(
            node.name, jsigType.typeExpression
        );
    } else if (node.type === 'Literal') {
        // Cannot load literal into identifiers table
        // do nothing
    } else {
        console.warn('got unknown module.exports node',
            node.type);
    }
};
