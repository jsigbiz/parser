'use strict';

var console = require('console');
var assert = require('assert');

var checkers = {
    'typeLiteral': checkTypeLiteral
};

module.exports = checkSubType;

// returns Error or null
function checkSubType(parent, child) {
    assert(parent && parent.type, 'parent must have type');
    assert(child && child.type, 'child must have type');

    if (checkers[parent.type]) {
        return checkers[parent.type](parent, child);
    } else {
        console.warn('skipping check sub type', parent.type);
    }
}

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
            return new Error('expected string got ' + child.name);
        }
    } else {
        console.warn('skipping other builtins', name);
    }
}
