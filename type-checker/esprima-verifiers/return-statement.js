'use strict';

var console = require('console');

var verify = require('../verify-esprima-ast.js');
var checkSubType = require('../check-sub-type.js');

module.exports = returnStatement;

function returnStatement(node, meta, callback) {
    var arg = node.argument;

    verify(arg, meta, function verifyArg(err, jsigType) {
        if (err) {
            return callback(err);
        }

        /* istanbul ignore if */
        if (!jsigType) {
            console.log('expected jsigType from return',
                'statement', node.argument.type);
            return callback(null);
        }

        var returnValueType = meta.currentMeta.returnValueType;
        var error = checkSubType(returnValueType, jsigType);
        if (error) {
            return callback(error);
        }

        callback(null, jsigType);
    });
}
