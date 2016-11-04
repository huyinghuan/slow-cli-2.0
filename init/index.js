"use strict";
const file_config_1 = require('../file-config');
const _fs = require('fs-extra');
const _globalConfig = {
    port: 14422,
    index: 'index.html',
    pluginConfig: {}
};
//准备plugin环境
function prepareBaseEnv() {
}
exports.prepareBaseEnv = prepareBaseEnv;
/**
 * 准备用户环境，配置等
 */
function prepareUserEnv() {
    if (!_fs.existsSync(file_config_1.default.CLIConfigFile)) {
        console.log(`非 ${file_config_1.default.infinity} 项目， 仅启用静态服务器功能`);
    }
    //读取项目目录下的package.json
    //读取package.json下用户自定义配置
    let packageJSON = require(file_config_1.default.CLIConfigFile);
    global.__CLI = packageJSON[file_config_1.default.infinity];
}
exports.prepareUserEnv = prepareUserEnv;
