"use strict";
const _ = require('lodash');
const generatorDefaultConfig_1 = require('./generatorDefaultConfig');
exports.generatorDefaultConfig = generatorDefaultConfig_1.default;
const getRemoteServerProjectPluginConfig_1 = require('./getRemoteServerProjectPluginConfig');
exports.getRemoteServerProjectPluginConfig = getRemoteServerProjectPluginConfig_1.default;
const checkBuildArgs_1 = require('./checkBuildArgs');
exports.checkBuildArgs = checkBuildArgs_1.default;
const checkStartArgs_1 = require('./checkStartArgs');
exports.checkStartArgs = checkStartArgs_1.default;
const prepareUserEnv_1 = require('./prepareUserEnv');
exports.prepareUserEnv = prepareUserEnv_1.default;
const prepareRuntimeEnv_1 = require('./prepareRuntimeEnv');
exports.prepareRuntimeEnv = prepareRuntimeEnv_1.default;
const preparePrerequisiteDir_1 = require('./preparePrerequisiteDir');
exports.preparePrerequisiteDir = preparePrerequisiteDir_1.default;
//设置环境
function setEnviroment(setting) {
    _.extend(global.__CLI, setting);
}
exports.setEnviroment = setEnviroment;
function getEnviroment() {
    return {
        enviroment: global.__CLI.enviroment,
        enviromentDir: global.__CLI.enviromentDir
    };
}
exports.getEnviroment = getEnviroment;
//设置build参数，用于 命令行指定参数
function setBuildParams(userInputAgruments) {
    _.extend(global.__CLI.buildConfig, userInputAgruments);
}
exports.setBuildParams = setBuildParams;
//设置start参数，用户 命令行制定参数
function setStartParams(userInputAgruments) {
    _.extend(global.__CLI, userInputAgruments);
}
exports.setStartParams = setStartParams;
//获取编译设置
function getBuildConfig() {
    return _.extend({}, global.__CLI.buildConfig);
}
exports.getBuildConfig = getBuildConfig;
// 仅为全局变量
function getFullConfig() {
    return global.__CLI;
}
exports.getFullConfig = getFullConfig;
