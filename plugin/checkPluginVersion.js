"use strict";
const _plugin = require('../plugin/index');
const _project = require('../project');
const _path = require('path');
const config_filed_constant_1 = require('../config-filed-constant');
const getFullPluginName_1 = require('./getFullPluginName');
const _fs = require('fs-extra');
//检查对比插件版本
function default_1(needAppointVersion) {
    needAppointVersion = needAppointVersion ? true : false;
    let needAppointVersionList = [];
    //获取插件配置
    let pluginConfig = _plugin.getPluginConfig();
    //搜集需要对比的插件。开发版本将跳过。
    let pluginList = [];
    Object.keys(pluginConfig).forEach((pluginName) => {
        if (/^(__)/.test(pluginName)) {
            return;
        }
        if (pluginConfig[pluginName] && pluginConfig[pluginName].__source) {
            console.log(`警告: ${pluginName} 处于开发模式,跳过版本对比`.yellow);
            return;
        }
        else if (pluginConfig[pluginName] == false) {
            console.log(`警告: ${pluginName} 已被禁用`.yellow);
            return;
        }
        //获取完整
        pluginName = getFullPluginName_1.default(pluginName);
        pluginList.push(pluginName);
    });
    let packageJSON = _project.getProjectPackageJSON();
    let dependencies = packageJSON.dependencies;
    if (pluginList.length == 0) {
        return true;
    }
    if (!dependencies) {
        console.log(`警告! 配置插件列表唯恐， 如果有需要请先安装插件`.yellow);
        if (needAppointVersion) {
            return pluginList;
        }
        return false;
    }
    let isMatch = true;
    for (let i = 0, length = pluginList.length; i < length; i++) {
        let pluginName = pluginList[i];
        let targetVersion = dependencies[pluginName];
        if (!_fs.existsSync(_path.join(config_filed_constant_1.default.pluginDir, pluginName))) {
            console.log(`警告! 配置${pluginName}未安装,请先安装插件`);
            needAppointVersionList.push(pluginName);
            isMatch = false;
            continue;
        }
        let currentVersion = require(_path.join(config_filed_constant_1.default.pluginDir, pluginName, 'package.json')).version;
        if (targetVersion == currentVersion) {
            continue;
        }
        console.log(`警告！插件：${pluginName} 项目依赖版本是 ${targetVersion}，实际版本是 ${currentVersion}`);
        needAppointVersionList.push(`${pluginName}@${targetVersion}`);
        isMatch = false;
    }
    if (needAppointVersion) {
        return needAppointVersionList;
    }
    return isMatch;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
