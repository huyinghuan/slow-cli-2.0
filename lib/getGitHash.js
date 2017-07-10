"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const git_head_hash_1 = require("git-head-hash");
const config_filed_constant_1 = require("../config-filed-constant");
function default_1(cb) {
    let workspace = config_filed_constant_1.default.getWorkspace();
    git_head_hash_1.default(workspace, cb);
}
exports.default = default_1;
