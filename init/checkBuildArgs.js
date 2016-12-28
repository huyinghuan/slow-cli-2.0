/**
 *校验build参数 */
"use strict";
const _path = require("path");
const _init = require("./index");
const config_filed_constant_1 = require("../config-filed-constant");
function checkOutDir() {
    let workspace = config_filed_constant_1.default.getWorkspace();
    let outdir = _init.getBuildConfig().outdir;
    let outRelativeDir = outdir;
    if (!outdir) {
        return false;
    }
    if (!_path.isAbsolute(outdir)) {
        outRelativeDir = outdir;
        outdir = _path.join(workspace, outdir);
    }
    if (workspace == outdir) {
        console.log("编译目录不能和项目跟目录为同一个");
        return false;
    }
    _init.setBuildParams({ outdir: outdir, outRelativeDir: outRelativeDir });
    return true;
}
function default_1() {
    return checkOutDir();
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
