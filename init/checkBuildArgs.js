/**
 *校验build参数 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _path = require("path");
const config_filed_constant_1 = require("../config-filed-constant");
function default_1() {
    let workspace = config_filed_constant_1.default.getWorkspace();
    let outdir = config_filed_constant_1.default.getBuildConfig('outdir');
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
    config_filed_constant_1.default.setBuildParams({ outdir: outdir, outRelativeDir: outRelativeDir });
    return true;
}
exports.default = default_1;
