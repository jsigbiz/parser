'use strict';

var console = require('console');

var verify = require('../verify-esprima-ast.js');

module.exports = variableDeclarator;

function variableDeclarator(node, meta, callback) {
    var id = node.id.name;

    verify(node.init, meta, function verifyDec(err, jsigAst) {
        if (err) {
            return callback(err);
        }

        if (!jsigAst) {
            console.warn('could not get type for', id);
        }

        meta.currentMeta.addVar(id, jsigAst);
        callback(null);
    });
}
