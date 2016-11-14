/**
 *校验build参数 */
"use strict";
const _path = require('path');
const _init = require('./index');
function checkOutDir() {
    let outdir = _init.getBuildConfig().outdir;
    if (!outdir) {
        return false;
    }
    if (!_path.isAbsolute(outdir)) {
        outdir = _path.join(process.cwd(), outdir);
    }
    if (process.cwd() == outdir) {
        console.log("编译目录不能和项目跟目录为同一个");
        return false;
    }
    _init.setBuildParams({ ourdir: outdir });
    return true;
}
function default_1() {
    return checkOutDir();
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
