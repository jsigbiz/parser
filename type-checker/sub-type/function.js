'use strict';

// var console = require('console');
var assert = require('assert');
var TypedError = require('error/typed');

var checkSubType = require('../check-sub-type.js');

var NonFunctionError = TypedError({
    message: 'Expected to get a function but found {valueType}',
    type: 'checker.subtype.function.non-function',
    valueType: null
});
var InvalidArgsCountError = TypedError({
    type: 'checker.subtype.function.invalid-args-count',
    message: 'Expected function to have {parentCount} number ' +
        'of arguments but found {childCount} instead.',
    parentCount: null,
    childCount: null
});

module.exports = checkFunction;

function checkFunction(parent, child) {
    if (child.type !== 'function') {
        return NonFunctionError({
            valueType: child.type
        });
    }

    var pargs = parent.args;
    var cargs = child.args;

    // Technically the child can have additional option args
    if (pargs.length !== cargs.length) {
        return InvalidArgsCountError({
            parentCount: pargs.length,
            childCount: cargs.length
        });
    }

    var errors = pargs.map(function checkArg(arg, index) {
        return checkSubType(arg, cargs[index]);
    }).filter(Boolean);

    if (errors[0]) {
        return errors[0];
    }

    var maybeErr = checkSubType(parent.result, child.result);
    if (maybeErr) {
        return maybeErr;
    }

    // check sub typing of constructors??
    assert(parent.thisArg === null && child.thisArg === null,
        'thisArg is not supported');

    return null;
}
