'use strict';

var console = require('console');
var TypedError = require('error/typed');

var NonStringError = TypedError({
    message: 'Expected to get a string but found {valueType}',
    type: 'checker.type-literal.non-string',
    valueType: null
});

module.exports = checkTypeLiteral;

function checkTypeLiteral(parent, child) {
    if (!parent.builtin) {
        console.warn('skipping non builtin type literal');
        return null;
    }

    if (child.type !== 'typeLiteral') {
        console.warn('skipping non typeLiteral child',
            child.type);
        return null;
    }

    var name = parent.name;

    if (name === 'String') {
        if (child.name !== 'String') {
            return NonStringError({
                valueType: child.name
            });
        }
    } else {
        console.warn('skipping other builtins', name);
    }
}
