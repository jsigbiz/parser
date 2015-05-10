'use strict';

var series = require('run-series');

var verify = require('../verify-esprima-ast.js');

module.exports = program;

function program(node, meta, callback) {
    node.body = hoistFunctionDeclaration(node.body);

    meta.setModuleExportsNode(node);
    meta.loadJsigDefinition(onLoaded);

    function onLoaded(err, jsigAst) {
        if (err) {
            return callback(err);
        }

        var tasks = node.body.map(function verifyNode(bodyNode) {
            return verify.bind(null, bodyNode, meta);
        });

        series(tasks, callback);
    }
}

// hoisting function declarations to the top makes the tree
// order algorithm simpler
function hoistFunctionDeclaration(nodes) {
    var declarations = nodes.filter(function isFunc(node) {
        return node.type === 'FunctionDeclaration';
    });
    var other = nodes.filter(function isNotFunc(node) {
        return node.type !== 'FunctionDeclaration';
    });

    return [].concat(declarations, other);
}
