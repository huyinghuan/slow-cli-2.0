"use strict";
const _mime = require('mime');
_mime.define({
    'text/html': ['hbs', 'ejs', 'jade'],
    'text/css': ['less', 'sass']
});
function default_1(path) {
    return _mime.lookup(path);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
