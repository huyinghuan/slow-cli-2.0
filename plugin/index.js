"use strict";
const getFullPluginName_1 = require('./getFullPluginName');
exports.getFullPluginName = getFullPluginName_1.default;
const scanPlugins_1 = require('./scanPlugins');
exports.scanPlugins = scanPlugins_1.default;
const loadPlugin_1 = require('./loadPlugin');
exports.loadPlugin = loadPlugin_1.default;
const checkPluginVersion_1 = require('./checkPluginVersion');
exports.checkPluginVersion = checkPluginVersion_1.default;
const install_1 = require('./install');
exports.install = install_1.default;
const setPluginConfig_1 = require('./setPluginConfig');
exports.setPluginConfig = setPluginConfig_1.default;
const writePluginConfigToConfigFile_1 = require('./writePluginConfigToConfigFile');
exports.writePluginConfigToConfigFile = writePluginConfigToConfigFile_1.default;
const getInstalledPluginVersion_1 = require('./getInstalledPluginVersion');
exports.getInstalledPluginVersion = getInstalledPluginVersion_1.default;
//获取插件设置 用于传递给hook plugin
function getPluginConfig() {
    return global.__CLI.pluginsConfig;
}
exports.getPluginConfig = getPluginConfig;
