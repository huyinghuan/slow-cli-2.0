/**
 *校验build参数 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_filed_constant_1 = require("../config-filed-constant");
function checkPort() {
    let port = ~~config_filed_constant_1.default.getGlobal('port');
    if (port > 65535) {
        console.log("port 设置值超过系统最大值 65535".red);
        return false;
    }
    if (port < 1024) {
        console.log("不建议使用1024以下系统端口，请修改".red);
        return false;
    }
    return true;
}
function default_1() {
    return checkPort();
}
exports.default = default_1;
