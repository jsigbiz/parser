'use strict';

module.exports = FileMeta;

/*  FileMeta is threaded through every verified which
    verifies that an AST node inside a file is type sound.

    This is the place to put meta data about the state of
    the file so taht each node in the AST can access it.

    Currently it is

    {
        parent: MetaObject,
        identifiers: Object<String, {
            type: 'variable' | 'function',
            jsig: JsigASTNode
        }>,
        type: 'file'
    }
*/

function FileMeta(parentMeta) {
    if (!(this instanceof FileMeta)) {
        return new FileMeta(parentMeta);
    }

    this.parent = parentMeta;
    this.identifiers = Object.create(parentMeta.identifiers);
    this.type = 'file';
}

FileMeta.prototype.addVar = function addVar(id, jsigType) {
    this.identifiers[id] = {
        type: 'variable',
        jsig: jsigType
    };
};
