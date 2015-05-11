'use strict';

var console = require('console');

module.exports = identifier;

function identifier(node, meta, callback) {
    var name = node.name;
    var identifiers = meta.currentMeta.identifiers;
    var type = identifiers[name] && identifiers[name].jsig;

    /* istanbul ignore if */
    if (!type) {
        console.warn('could not find type for identifier',
            name);
        return callback(null);
    }

    callback(null, type);
}
