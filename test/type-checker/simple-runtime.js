'use strict';

var test = require('tape');
var path = require('path');

var compile = require('../../bin/type-check.js');

test('compile good example 1', function t(assert) {
    var file = path.join(__dirname, '..',
        'fixtures', 'simple-runtime', 'good-example-1.js');

    compile({
        _: [file]
    }, function onCompiled(err, meta) {
        assert.ifError(err);

        assert.ok(meta);

        var identifiers = meta.currentMeta.identifiers;

        assert.ok(meta && identifiers.require);
        assert.ok(meta && identifiers.sum);

        assert.end();
    });
});

test('compile bad example 1', function t(assert) {
    var file = path.join(__dirname, '..',
        'fixtures', 'simple-runtime', 'bad-example-1.js');

    compile({
        _: [file]
    }, function onMeta(err, meta) {
        assert.ok(err);

        assert.equal(err.message, 'expected string got Number');

        assert.end();
    });
});

test('compile bad example 1', function t(assert) {
    var file = path.join(__dirname, '..',
        'fixtures', 'simple-runtime', 'bad-example-2.js');

    compile({
        _: [file]
    }, function onMeta(err, meta) {
        assert.ok(err);

        assert.equal(err.message, 'expected string got Number');

        assert.end();
    });
});
