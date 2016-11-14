"use strict";
const _minimatch = require('minimatch');
const _ = require('lodash');
/**
 * 文件后缀匹配
 */
function match(path, express) {
    return _minimatch(path, express, { matchBase: true });
}
exports.match = match;
/**
 *lodash.extend
 */
function extend() {
    return _.extend.apply(null, arguments);
}
exports.extend = extend;
