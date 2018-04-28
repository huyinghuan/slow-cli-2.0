"use strict";
/**
 *校验build参数 */
Object.defineProperty(exports, "__esModule", { value: true });
const _path = require("path");
const config_filed_constant_1 = require("../config-filed-constant");
function default_1() {
    let workspace = config_filed_constant_1.default.getWorkspace();
    let outdir = config_filed_constant_1.default.getBuildConfig('outdir');
    let outRelativeDir = outdir;
    if (!outdir) {
        throw new Error('编译输出目录不存在');
    }
    if (!_path.isAbsolute(outdir)) {
        outRelativeDir = outdir;
        outdir = _path.join(workspace, outdir);
    }
    if (workspace == outdir) {
        throw new Error("编译输出目录不能和项目跟目录为同一个");
    }
    config_filed_constant_1.default.setBuildParams({ outdir: outdir, outRelativeDir: outRelativeDir });
}
exports.default = default_1;
