"use strict";
const generatorDefaultConfig_1 = require('./generatorDefaultConfig');
const config_filed_constant_1 = require('../config-filed-constant');
const _fs = require('fs-extra');
const index_1 = require('./index');
/**
 * 准备用户环境，配置等
 */
function prepareUserEnv() {
    let config = {};
    let defaultConfig = generatorDefaultConfig_1.default();
    if (!_fs.existsSync(config_filed_constant_1.default.CLIConfigFile)) {
        console.log(`非 ${config_filed_constant_1.default.infinity} 项目， 仅启用静态服务器功能`);
        config = defaultConfig;
    }
    else {
        //读取项目目录下的package.json
        //读取package.json下用户自定义配置
        config = index_1.getProjectPackageJSON();
    }
    //如果package.json里面没有相关配置，那么则使用默认配置。
    global.__CLI = config[config_filed_constant_1.default.infinity] || defaultConfig[config_filed_constant_1.default.infinity];
    global.__CLI.pluginsConfig = config[config_filed_constant_1.default.pluginConfigField];
    global.__CLI.buildConfig = config[config_filed_constant_1.default.buildField] || defaultConfig[config_filed_constant_1.default.buildField];
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = prepareUserEnv;
