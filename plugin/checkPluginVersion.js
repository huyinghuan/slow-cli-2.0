"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _project = require("../project");
const _path = require("path");
const config_filed_constant_1 = require("../config-filed-constant");
const getFullPluginName_1 = require("./getFullPluginName");
const _fs = require("fs-extra");
const log_1 = require("../lib/log");
//检查对比插件版本
function default_1(needAppointVersion) {
    let configFiledConstant = config_filed_constant_1.default.get();
    needAppointVersion = needAppointVersion ? true : false;
    let needAppointVersionList = [];
    //获取插件配置
    let pluginConfig = config_filed_constant_1.default.getPluginConfig();
    //搜集需要对比的插件。开发版本将跳过。
    let pluginList = [];
    Object.keys(pluginConfig).forEach((pluginName) => {
        if (/^(__)/.test(pluginName)) {
            return;
        }
        if (pluginConfig[pluginName] && pluginConfig[pluginName].__source) {
            log_1.default.warn(`警告: ${pluginName} 处于开发模式,跳过版本对比`.yellow);
            return;
        }
        else if (pluginConfig[pluginName] == false) {
            log_1.default.warn(`警告: ${pluginName} 已被禁用`.yellow);
            return;
        }
        //获取完整
        pluginName = getFullPluginName_1.default(pluginName);
        pluginList.push(pluginName);
    });
    let packageJSON = _project.getProjectPackageJSON();
    let dependencies = packageJSON["dependencies"] || {};
    let devDependencies = packageJSON["devDependencies"] || {};
    if (pluginList.length == 0) {
        return true;
    }
    if (!dependencies && !devDependencies) {
        log_1.default.warn(`警告! 配置插件列表为空， 如果有需要请先安装插件`.yellow);
        if (needAppointVersion) {
            return pluginList;
        }
        return false;
    }
    let isMatch = true;
    for (let i = 0, length = pluginList.length; i < length; i++) {
        let pluginName = pluginList[i];
        let targetVersion = dependencies[pluginName] || devDependencies[pluginName];
        if (!_fs.existsSync(_path.join(configFiledConstant.pluginDir, pluginName))) {
            log_1.default.error(`错误! 插件配置${pluginName}未安装,请先安装插件`.red);
            needAppointVersionList.push(pluginName);
            isMatch = false;
            continue;
        }
        let currentVersion = _fs.readJSONSync(_path.join(configFiledConstant.pluginDir, pluginName, 'package.json')).version;
        if (targetVersion == currentVersion) {
            continue;
        }
        log_1.default.error(`错误！插件：${pluginName} 项目依赖版本是 ${targetVersion}，实际版本是 ${currentVersion}`.red);
        needAppointVersionList.push(`${pluginName}@${targetVersion}`);
        isMatch = false;
    }
    if (needAppointVersion) {
        return needAppointVersionList;
    }
    return isMatch;
}
exports.default = default_1;
