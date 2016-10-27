"use strict";
const config_1 = require('./config');
const _fs = require('fs-extra');
const _path = require('path');
const _hooks = require('./hooks/index');
//准备plugin环境
function prepareBaseEnv() {
    //确保根目录存在
    _fs.ensureDirSync(config_1.default.cliRootDir);
    //确保package.json存在 //输出默认配置到  ~/.xxx/packageJSON
    if (!_fs.existsSync(config_1.default.plguinPackageJSON)) {
        _fs.outputJSONSync(config_1.default.plguinPackageJSON, config_1.default.pluginInfo);
    }
}
exports.prepareBaseEnv = prepareBaseEnv;
/**
 * 准备用户环境，配置等
 */
function prepareUserEnv() {
    //读取项目目录下的package.json
    //读取package.json下用户自定义配置
    let packageJSON = require(_path.join(process.cwd(), 'package.json'));
    global.__CLI = packageJSON[config_1.default.infinity];
}
exports.prepareUserEnv = prepareUserEnv;
/**
 * 加载插件
 */
function loadPlugins(cb) { _hooks.scanPlugins(cb); }
exports.loadPlugins = loadPlugins;
