'use strict';

var series = require('run-series');

var verify = require('../verify-esprima-ast.js');

module.exports = blockStatement;

function blockStatement(node, meta, callback) {
    var tasks = node.body.map(function verifyNode(st) {
        return verify.bind(null, st, meta);
    });

    series(tasks, callback);
}
