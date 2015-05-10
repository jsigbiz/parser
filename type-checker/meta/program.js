'use strict';

var JsigAST = require('../../ast.js');
var FileMeta = require('./file.js');

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
