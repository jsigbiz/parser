'use strict';

// circular require buster
module.exports = compile;

var readAST = require('./lib/read-ast.js');
var verify = require('./verify-esprima-ast.js');
var ProgramMeta = require('./meta/program.js');

function compile(filename, callback) {
    readAST(filename, onAST);

    function onAST(err, ast) {
        if (err) {
            return callback(err);
        }

        var meta = ProgramMeta(ast, filename);

        verify(ast, meta, function onVerified(err2) {
            if (err2) {
                return callback(err2);
            }

            callback(null, meta);
        });
    }
}
