'use strict';

var series = require('run-series');
// var console = require('console');

var verify = require('../verify-esprima-ast.js');
var checkSubType = require('../check-sub-type.js');

module.exports = assignmentExpression;

function assignmentExpression(node, meta, callback) {
    var args = [node.left, node.right];
    var tasks = args.map(function verifyArg(arg) {
        return verify.bind(null, arg, meta);
    });

    series(tasks, function onVerified(err, argTypes) {
        if (err) {
            return callback(err);
        }

        var leftType = argTypes[0];
        var rightType = argTypes[1];

        // find the type of identifier;
        // assert that right is a subType of identifier?

        var maybeErr = checkSubType(leftType, rightType);
        if (maybeErr) {
            return callback(maybeErr);
        }

        callback(null, rightType);
    });
}
