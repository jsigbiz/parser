'use strict';

var console = require('console');
var assert = require('assert');

// break circular references
module.exports = checkSubType;

var checkers = {
    'typeLiteral': require('./sub-type/type-literal.js'),
    'function': require('./sub-type/function.js')
};

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
