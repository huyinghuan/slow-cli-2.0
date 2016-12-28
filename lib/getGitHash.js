"use strict";
const _fs = require("fs");
const _path = require("path");
const child_process_1 = require("child_process");
const config_filed_constant_1 = require("../config-filed-constant");
function default_1(cb) {
    let workspace = config_filed_constant_1.default.getWorkspace();
    let commandStr = `git log -1 --format="%H"`;
    if (!_fs.existsSync(_path.join(workspace, ".git"))) {
        return cb(null, null);
    }
    child_process_1.exec(commandStr, { cwd: workspace }, (error, stdout, stderr) => {
        if (error) {
            return cb(error);
        }
        stdout = stdout.replace(/^(\s)+/, "").replace(/(\s)+$/, "");
        //去空格
        stdout = stdout.replace(/^\s*/, "").replace(/\s*$/, "");
        //如果还有空格
        if (/\s/.test(stdout)) {
            return cb(null, null);
        }
        cb(null, stdout);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
