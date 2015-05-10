'use strict';

var console = require('console');

var verify = require('../verify-esprima-ast.js');

module.exports = assignmentExpression;

function assignmentExpression(node, meta, callback) {
    console.log('assignment', node);

    // return the type of right
    verify(node.right, meta, callback);
}
