"use strict";
const _mime = require('mime');
_mime.define({
    'text/html': ['hbs'],
    'text/css': ['less']
});
function default_1(path) {
    return _mime.lookup(path);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
