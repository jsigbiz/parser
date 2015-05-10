'use strict';

var assert = require('assert');

var verify = require('../verify-esprima-ast.js');

module.exports = memberExpression;

function memberExpression(node, meta, callback) {
    verify(node.object, meta, onType);

    function onType(err, objType) {
        if (err) {
            return callback(err);
        }

        var property = node.property;
        assert(property.type === 'Identifier',
            'property in member expr must be an Identifier');

        var propertyName = property.name;

        var valueType = findPropertyInType(objType, propertyName);

        callback(null, valueType);
    }
}

function findPropertyInType(jsigType, propertyName) {
    assert(jsigType.type === 'object',
        'jsigType must be an object');

    for (var i = 0; i < jsigType.keyValues.length; i++) {
        var keyValue = jsigType.keyValues[i];
        if (keyValue.key === propertyName) {
            return keyValue.value;
        }
    }

    return null;
}
