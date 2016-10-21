"use strict";
const config_1 = require('./config');
const _fs = require('fs-extra');
function prepareBaseEnv() {
    //确保根目录存在
    _fs.ensureDirSync(config_1.default.cliRootDir);
    //确保package.json存在 //写出默认信息
    if (!_fs.existsSync(config_1.default.plguinPackageJSON)) {
        _fs.outputJSONSync(config_1.default.plguinPackageJSON, config_1.default.pluginInfo);
    }
}
exports.prepareBaseEnv = prepareBaseEnv;
/**
 * 加载插件
 */
function loadPlugins() {
}
exports.loadPlugins = loadPlugins;
