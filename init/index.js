"use strict";
const file_config_1 = require('../file-config');
const _fs = require('fs-extra');
const generatorDefaultConfig_1 = require('./generatorDefaultConfig');
exports.generatorDefaultConfig = generatorDefaultConfig_1.default;
const getRemoteServerProjectPluginConfig_1 = require('./getRemoteServerProjectPluginConfig');
exports.getRemoteServerProjectPluginConfig = getRemoteServerProjectPluginConfig_1.default;
const setPluginConfig_1 = require('./setPluginConfig');
exports.setPluginConfig = setPluginConfig_1.default;
//返回packageJson内容
function getProjectPackageJSON() {
    if (!_fs.existsSync(file_config_1.default.CLIConfigFile)) {
        return {};
    }
    return require(file_config_1.default.CLIConfigFile);
}
exports.getProjectPackageJSON = getProjectPackageJSON;
/**
 * 准备用户环境，配置等
 */
function prepareUserEnv() {
    let config = {};
    if (!_fs.existsSync(file_config_1.default.CLIConfigFile)) {
        console.log(`非 ${file_config_1.default.infinity} 项目， 仅启用静态服务器功能`);
        config = generatorDefaultConfig_1.default();
    }
    else {
        //读取项目目录下的package.json
        //读取package.json下用户自定义配置
        config = getProjectPackageJSON();
    }
    global.__CLI = config[file_config_1.default.infinity];
    global.__CLI.pluginsConfig = config[file_config_1.default.pluginConfigField];
    global.__CLI.buildConfig = config[file_config_1.default.buildField];
}
exports.prepareUserEnv = prepareUserEnv;
