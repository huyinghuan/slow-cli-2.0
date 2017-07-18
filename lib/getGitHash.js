"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _gitHeadHash = require("git-head-hash");
const config_filed_constant_1 = require("../config-filed-constant");
const _path = require("path");
const _fs = require("fs");
function default_1(cb) {
    let workspace = config_filed_constant_1.default.getWorkspace();
    let gitPath = _path.join(workspace, ".git");
    if (_fs.existsSync(gitPath)) {
        _gitHeadHash(workspace, cb);
    }
    else {
        cb(null, "NOT-GIT-PROJECT");
    }
}
exports.default = default_1;
