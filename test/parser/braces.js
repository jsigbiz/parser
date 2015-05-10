'use strict';

var test = require('tape');

var parse = require('../../parser.js');

test('foo : (String)', function t(assert) {
    var content = 'foo : (String)';
    var result = parse(content).statements[0];

    assert.equal(result.type, 'assignment');
    assert.equal(result.identifier, 'foo');
    assert.deepEqual(result.typeExpression, {
        type: 'typeLiteral',
        builtin: true,
        label: null,
        optional: false,
        name: 'String'
    });

    assert.end();
});

test('foo : (String | Number)', function t(assert) {
    var content = 'foo : (String | Number)';
    var result = parse(content).statements[0];

    assert.equal(result.type, 'assignment');
    assert.equal(result.identifier, 'foo');
    assert.deepEqual(result.typeExpression, {
        type: 'unionType',
        unions: [{
            type: 'typeLiteral',
            label: null,
            optional: false,
            name: 'String',
            builtin: true
        }, {
            type: 'typeLiteral',
            label: null,
            optional: false,
            name: 'Number',
            builtin: true
        }],
        label: null,
        optional: false
    });

    assert.end();
});

test('foo : (A) => B | C', function t(assert) {
    var content = 'foo : (A) => B | C';
    var result = parse(content).statements[0];

    assert.equal(result.type, 'assignment');
    assert.equal(result.identifier, 'foo');
    assert.deepEqual(result.typeExpression, {
        type: 'function',
        thisArg: null,
        args: [{
            type: 'typeLiteral',
            builtin: false,
            label: null,
            optional: false,
            name: 'A'
        }],
        result: {
            type: 'unionType',
            unions: [{
                type: 'typeLiteral',
                label: null,
                optional: false,
                name: 'B',
                builtin: false
            }, {
                type: 'typeLiteral',
                label: null,
                optional: false,
                name: 'C',
                builtin: false
            }],
            label: null,
            optional: false
        },
        label: null,
        optional: false
    });

    assert.end();
});

test('foo : (A) => (B | C)', function t(assert) {
    var content = 'foo : (A) => (B | C)';
    var result = parse(content).statements[0];

    assert.equal(result.type, 'assignment');
    assert.equal(result.identifier, 'foo');
    assert.deepEqual(result.typeExpression, {
        type: 'function',
        thisArg: null,
        args: [{
            type: 'typeLiteral',
            builtin: false,
            label: null,
            optional: false,
            name: 'A'
        }],
        result: {
            type: 'unionType',
            unions: [{
                type: 'typeLiteral',
                label: null,
                optional: false,
                name: 'B',
                builtin: false
            }, {
                type: 'typeLiteral',
                label: null,
                optional: false,
                name: 'C',
                builtin: false
            }],
            label: null,
            optional: false
        },
        label: null,
        optional: false
    });

    assert.end();
});

test('foo : ((A) => B | C)', function t(assert) {
    var content = 'foo : ((A) => B | C)';
    var result = parse(content).statements[0];

    assert.equal(result.type, 'assignment');
    assert.equal(result.identifier, 'foo');
    assert.deepEqual(result.typeExpression, {
        type: 'function',
        thisArg: null,
        args: [{
            type: 'typeLiteral',
            builtin: false,
            label: null,
            optional: false,
            name: 'A'
        }],
        result: {
            type: 'unionType',
            unions: [{
                type: 'typeLiteral',
                label: null,
                optional: false,
                name: 'B',
                builtin: false
            }, {
                type: 'typeLiteral',
                label: null,
                optional: false,
                name: 'C',
                builtin: false
            }],
            label: null,
            optional: false
        },
        label: null,
        optional: false
    });

    assert.end();
});

test('foo : ((A) => (B | C))', function t(assert) {
    var content = 'foo : ((A) => (B | C))';
    var result = parse(content).statements[0];

    assert.equal(result.type, 'assignment');
    assert.equal(result.identifier, 'foo');
    assert.deepEqual(result.typeExpression, {
        type: 'function',
        thisArg: null,
        args: [{
            type: 'typeLiteral',
            builtin: false,
            label: null,
            optional: false,
            name: 'A'
        }],
        result: {
            type: 'unionType',
            unions: [{
                type: 'typeLiteral',
                label: null,
                optional: false,
                name: 'B',
                builtin: false
            }, {
                type: 'typeLiteral',
                label: null,
                optional: false,
                name: 'C',
                builtin: false
            }],
            label: null,
            optional: false
        },
        label: null,
        optional: false
    });

    assert.end();
});

test('foo : ((A) => B) | C', function t(assert) {
    var content = 'foo : ((A) => B) | C';
    var result = parse(content).statements[0];

    assert.equal(result.type, 'assignment');
    assert.equal(result.identifier, 'foo');
    assert.deepEqual(result.typeExpression, {
        type: 'unionType',
        unions: [{
            type: 'function',
            thisArg: null,
            args: [{
                type: 'typeLiteral',
                builtin: false,
                label: null,
                optional: false,
                name: 'A'
            }],
            result: {
                type: 'typeLiteral',
                label: null,
                optional: false,
                name: 'B',
                builtin: false
            },
            label: null,
            optional: false
        }, {
            type: 'typeLiteral',
            builtin: false,
            label: null,
            optional: false,
            name: 'C'
        }],
        label: null,
        optional: false
    });

    assert.end();
});

test('foo : ((String) => String) | ((Number) => Number)', function t(assert) {
    var content = 'foo : ((String) => String) | ((Number) => Number)';
    var result = parse(content).statements[0];

    assert.equal(result.type, 'assignment');
    assert.equal(result.identifier, 'foo');
    assert.deepEqual(result.typeExpression, {
        type: 'unionType',
        unions: [{
            type: 'function',
            thisArg: null,
            args: [{
                type: 'typeLiteral',
                builtin: true,
                label: null,
                optional: false,
                name: 'String'
            }],
            result: {
                type: 'typeLiteral',
                label: null,
                optional: false,
                name: 'String',
                builtin: true
            },
            label: null,
            optional: false
        }, {
            type: 'function',
            thisArg: null,
            args: [{
                type: 'typeLiteral',
                builtin: true,
                label: null,
                optional: false,
                name: 'Number'
            }],
            result: {
                type: 'typeLiteral',
                label: null,
                optional: false,
                name: 'Number',
                builtin: true
            },
            label: null,
            optional: false
        }],
        label: null,
        optional: false
    });

    assert.end();
});
