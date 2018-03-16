"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _project = require("../project");
const config_filed_constant_1 = require("../config-filed-constant");
//写入插件配置到配置文件，用于安装插件时，配置默认项
function getPluginConfig(pluginName) {
    let packageJSON = _project.getProjectPackageJSON();
    let pluginConfig = packageJSON[config_filed_constant_1.default.get().pluginConfigField];
    return pluginConfig[pluginName] ? pluginConfig[pluginName] : {};
}
exports.default = getPluginConfig;
