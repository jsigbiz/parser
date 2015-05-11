'use strict';

var console = require('console');

var AST = require('../../ast.js');

module.exports = literal;

function literal(node, meta, callback) {
    var value = node.value;

    /* istanbul ignore if */
    if (!value) {
        console.warn('cannot get value for node', value);
        return callback(null);
    }

    /* istanbul ignore else */
    if (typeof value === 'string') {
        callback(null, AST.literal('String'));
    } else if (typeof value === 'number') {
        callback(null, AST.literal('Number'));
    } else {
        console.warn('literal not implement for value',
            typeof value);
        callback(null);
    }
}
