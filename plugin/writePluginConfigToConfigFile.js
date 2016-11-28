"use strict";
const _plugin = require('./index');
const _project = require('../project');
//写入插件配置到配置文件，用于安装插件时，配置默认项
function writePluginConfigToConfigFile(pluginConfig) {
    let packageJSON = _project.getProjectPackageJSON();
    packageJSON = _plugin.setPluginConfig(packageJSON, pluginConfig);
    _project.writeProjectPackageJSON(packageJSON);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = writePluginConfigToConfigFile;
