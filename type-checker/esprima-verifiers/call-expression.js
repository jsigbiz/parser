'use strict';

var series = require('run-series');
var console = require('console');
var TypedError = require('error/typed');

var verify = require('../verify-esprima-ast.js');
var inferTypeFromRequire = require('../infer-type-from-require.js');
var checkSubType = require('../check-sub-type.js');

var InvalidCallArgCountError = TypedError({
    type: 'checker.verifier.call-expr.invalid-call-arg-count',
    message: 'Expected call expression to have {count} ' +
        'number of args but found {invalidCount} args',
    count: null,
    invalidCount: null
});

module.exports = callExpression;

/*  must verify call expression.

    Fetch the type of the identifier that is being called.

    verify that all arguments are valid types

    return the type of the result of the function to the
        callback
*/
function callExpression(node, meta, callback) {
    var callee = node.callee.name;

    var identifiers = meta.currentMeta.identifiers;

    if (!identifiers[callee]) {
        console.warn('skipping call expression', callee);
        return callback(null);
    }

    var funcType = identifiers[callee].jsig;

    var tasks = node.arguments.map(function verifyArg(arg) {
        return verify.bind(null, arg, meta);
    });
    series(tasks, onargs);

    function onargs(err, args) {
        if (err) {
            return callback(err);
        }

        // TODO allow optional arguments
        if (funcType.args.length !== args.length) {
            return callback(InvalidCallArgCountError({
                count: funcType.args.length,
                invalidCount: args.length
            }));
        }

        var errors = args.map(function checkArg(type, index) {
            if (!type) {
                return new Error('could not get type for ' +
                    node.arguments[index].type);
            }

            return checkSubType(funcType.args[index], type);
        }).filter(Boolean);

        if (errors.length) {
            return callback(errors[0]);
        }

        if (!funcType.isNodeRequireToken) {
            return callback(null, funcType.result);
        }

        // special case for require. The require function has a
        // return value of Any but we can find the real type by
        // loading the source and analyzing it either by loading
        // the correct jsig definition file or
        // by doing type inference
        inferTypeFromRequire(node, meta, callback);
    }
}
