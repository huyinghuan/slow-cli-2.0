"use strict";
const file_config_1 = require('../file-config');
const _fs = require('fs-extra');
const _ = require('lodash');
const generatorDefaultConfig_1 = require('./generatorDefaultConfig');
exports.generatorDefaultConfig = generatorDefaultConfig_1.default;
const getRemoteServerProjectPluginConfig_1 = require('./getRemoteServerProjectPluginConfig');
exports.getRemoteServerProjectPluginConfig = getRemoteServerProjectPluginConfig_1.default;
const setPluginConfig_1 = require('./setPluginConfig');
exports.setPluginConfig = setPluginConfig_1.default;
const checkBuildArgs_1 = require('./checkBuildArgs');
exports.checkBuildArgs = checkBuildArgs_1.default;
const checkStartArgs_1 = require('./checkStartArgs');
exports.checkStartArgs = checkStartArgs_1.default;
function getProjectPackageJSONField(fieldName) {
    let json = getProjectPackageJSON();
    return json[fieldName];
}
exports.getProjectPackageJSONField = getProjectPackageJSONField;
//返回packageJson内容
function getProjectPackageJSON(fieldName) {
    if (!_fs.existsSync(file_config_1.default.CLIConfigFile)) {
        return {};
    }
    return _fs.readJSONSync(file_config_1.default.CLIConfigFile); //require(_config.CLIConfigFile)
}
exports.getProjectPackageJSON = getProjectPackageJSON;
//写入package.json文件
function writeProjectPackageJSON(packageJSON) {
    _fs.outputJSONSync(file_config_1.default.CLIConfigFile, packageJSON);
}
exports.writeProjectPackageJSON = writeProjectPackageJSON;
/**
 * 准备用户环境，配置等
 */
function prepareUserEnv() {
    let config = {};
    let defaultConfig = generatorDefaultConfig_1.default();
    if (!_fs.existsSync(file_config_1.default.CLIConfigFile)) {
        console.log(`非 ${file_config_1.default.infinity} 项目， 仅启用静态服务器功能`);
        config = defaultConfig;
    }
    else {
        //读取项目目录下的package.json
        //读取package.json下用户自定义配置
        config = getProjectPackageJSON();
    }
    //如果package.json里面没有相关配置，那么则使用默认配置。
    global.__CLI = config[file_config_1.default.infinity] || defaultConfig[file_config_1.default.infinity];
    global.__CLI.pluginsConfig = config[file_config_1.default.pluginConfigField];
    global.__CLI.buildConfig = config[file_config_1.default.buildField] || defaultConfig[file_config_1.default.buildField];
}
exports.prepareUserEnv = prepareUserEnv;
function setBuildParams(userInputAgruments) {
    _.extend(global.__CLI.buildConfig, userInputAgruments);
}
exports.setBuildParams = setBuildParams;
function setStartParams(userInputAgruments) {
    _.extend(global.__CLI, userInputAgruments);
}
exports.setStartParams = setStartParams;
function getBuildConfig() {
    return global.__CLI.buildConfig;
}
exports.getBuildConfig = getBuildConfig;
function getPluginConfig() {
    return global.__CLI.pluginsConfig;
}
exports.getPluginConfig = getPluginConfig;
// 仅为全局变量
function getFullConfig() {
    return global.__CLI;
}
exports.getFullConfig = getFullConfig;
function writePluginConfigToConfigFile(pluginConfig) {
    let packageJSON = getProjectPackageJSON();
    packageJSON = setPluginConfig_1.default(packageJSON, pluginConfig);
    _fs.outputJSONSync(file_config_1.default.CLIConfigFile, packageJSON);
}
exports.writePluginConfigToConfigFile = writePluginConfigToConfigFile;
