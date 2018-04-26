"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _project = require("./project");
const _fs = require("fs-extra");
const _request = require("request");
const public_1 = require("./public");
const log_1 = require("./lib/log");
const config_filed_constant_1 = require("./config-filed-constant");
const packageJSON = require('../package');
function getVersion() {
    return packageJSON.version;
}
exports.getVersion = getVersion;
function checkVersion() {
    let configFiledConstant = config_filed_constant_1.default.get();
    if (!_fs.existsSync(configFiledConstant.CLIConfigFile)) {
        console.log('默认执行环境，跳过CLI环境检查');
        return true;
    }
    let packageJSON = _project.getProjectPackageJSON();
    let currentCLIVersion = packageJSON.version;
    let macth = packageJSON[configFiledConstant.pluginVersionField] == currentCLIVersion;
    if (macth) {
        return true;
    }
    else {
        console.log(`警告: 项目要求${configFiledConstant.infinity}版本是: ${packageJSON[configFiledConstant.pluginVersionField]} ,本机实际版本为: ${currentCLIVersion}`.red);
        return false;
    }
}
exports.checkVersion = checkVersion;
function checkLatestVersion() {
    let latestQueryURLPrivate = public_1.default.private_npm_registry + "/silky-reborn/latest";
    let latestQueryURLPublic = "https://registry.npm.taobao.org/silky-reborn/latest";
    let nowVersion = getVersion();
    _request(latestQueryURLPrivate, (err, httpResponse, body) => {
        if (!err && httpResponse.statusCode == 200) {
            body = JSON.parse(body);
            if (body.version != nowVersion) {
                log_1.default.info(`silky 存在新版本: ${body.version}\n推荐升级[Mac或Linux 前面 加sudo]：mgtv install -g silky-reborn `.blue);
            }
            return;
        }
        _request(latestQueryURLPublic, (err, httpResponse, body) => {
            if (!err && httpResponse.statusCode == 200) {
                body = JSON.parse(body);
                if (body.version != nowVersion) {
                    log_1.default.info(`silky 存在新版本:${body.version}, 推荐升级：npm install -g silky-reborn [mac 前面 加sudo]`.blue);
                }
                return;
            }
        });
    });
}
exports.checkLatestVersion = checkLatestVersion;
