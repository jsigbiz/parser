'use strict';

var parallel = require('run-parallel');

var verify = require('../verify-esprima-ast.js');

module.exports = variableDeclaration;

function variableDeclaration(node, meta, callback) {
    var tasks = node.declarations.map(function verifyDec(dec) {
        return verify.bind(null, dec, meta);
    });

    parallel(tasks, callback);
}
