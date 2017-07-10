"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _gitHeadHash = require("git-head-hash");
const config_filed_constant_1 = require("../config-filed-constant");
function default_1(cb) {
    let workspace = config_filed_constant_1.default.getWorkspace();
    _gitHeadHash(workspace, cb);
}
exports.default = default_1;
