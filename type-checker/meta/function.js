'use strict';

var console = require('console');
var assert = require('assert');

module.exports = FunctionMeta;

/*  FunctionMeta is threaded through every verifier which
    veirfiers that an AST node inside a function body is
    type sound

    This is a place to put meta data about the state of the
    function so taht each node in the AST can access it.

    Currently it is

    {
        parent: MetaObject,
        identifiers: Object<String, {
            type: 'variable' | 'function',
            jsig: JsigASTNode
        }>,
        returnValueType: JsigASTNode,
        type: 'function'
    }
*/
function FunctionMeta(parentMeta) {
    if (!(this instanceof FunctionMeta)) {
        return new FunctionMeta(parentMeta);
    }

    assert(parentMeta, 'must specify parentMeta');

    this.parent = parentMeta;
    this.identifiers = Object.create(parentMeta.identifiers);
    this.returnValueType = null;
    this.type = 'function';
}

FunctionMeta.prototype.addVar = function addVar(id, jsigType) {
    this.identifiers[id] = {
        type: 'variable',
        jsig: jsigType
    };
};

FunctionMeta.createFromNode =
function createFromNode(parentMeta, node, jsigType) {
    var fMeta = FunctionMeta(parentMeta);

    node.params.forEach(function checkParam(param, index) {
        if (param.type !== 'Identifier') {
            console.warn('unknown param node', param.type);
            return;
        }

        var name = param.name;
        var paramType = jsigType.args[index];

        fMeta.identifiers[name] = {
            type: 'variable',
            jsig: paramType
        };
    });

    fMeta.returnValueType = jsigType.result;
    return fMeta;
};
