'use strict';

var path = require('path');
var console = require('console');

var typeCheck = require('../type-checker/');

module.exports = inferTypeFromRequire;

function inferTypeFromRequire(node, meta, callback) {
    var arg = node.arguments[0].value;

    var dirname = path.dirname(meta.filename);
    var uri;
    // TODO handle non local uris
    // TODO replace resolve logic with node-resolve module
    if (arg[0] === '.') {
        uri = path.resolve(dirname, arg);
    }

    if (!uri) {
        console.log('arg', node);
        console.warn('skipping require analysis for', arg);
        return callback(null);
    }

    // handle folders. lengthen to index.js
    if (uri.substr(-3) !== '.js') {
        uri = path.join(uri, 'index.js');
    }

    typeCheck(uri, function onChecked(err2, fileMeta) {
        if (err2) {
            return callback(err2);
        }

        // console.log('requireMeta', meta)
        callback(null, fileMeta.moduleExportsType);
    });
}
