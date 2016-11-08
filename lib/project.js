"use strict";
/**
 * 用于检测，获取项目相关信息
 */
const _path = require('path');
const file_config_1 = require('../file-config');
const _fs = require('fs-extra');
const _hooks = require('../hooks/index');
const index_1 = require('../init/index');
function getProjectDirectoryName() {
    return process.cwd().split(_path.sep).pop();
}
exports.getProjectDirectoryName = getProjectDirectoryName;
function getCLIVersion() {
    return require('../package').version;
}
exports.getCLIVersion = getCLIVersion;
//对比版本给出提示
function checkCLIVersion() {
    if (!_fs.existsSync(file_config_1.default.CLIConfigFile)) {
        console.log('默认执行环境，跳过CLI环境检查');
        return true;
    }
    let packageJSON = index_1.getProjectPackageJSON();
    let currentCLIVersion = getCLIVersion();
    let macth = packageJSON[file_config_1.default.pluginVersionField] == currentCLIVersion;
    if (macth) {
        return true;
    }
    else {
        console.log(`警告: 项目要求${file_config_1.default.infinity}版本是: ${packageJSON[file_config_1.default.pluginVersionField]} ,本机实际版本为: ${currentCLIVersion}`.red);
        return false;
    }
}
exports.checkCLIVersion = checkCLIVersion;
//检查对比插件版本
function checkPluginVersion() {
    //获取插件配置
    let pluginConfig = global.__CLI.pluginsConfig;
    //搜集需要对比的插件。开发版本将跳过。
    let pluginList = [];
    Object.keys(pluginConfig).forEach((pluginName) => {
        if (pluginConfig[pluginName] && pluginConfig[pluginName].source) {
            console.log(`警告: ${pluginName} 处于开发模式,跳过版本对比`.yellow);
            return;
        }
        //获取完整
        pluginName = _hooks.getFullPluginName(pluginName);
        pluginList.push(pluginName);
    });
    let packageJSON = index_1.getProjectPackageJSON();
    let dependencies = packageJSON.dependencies;
    if (!dependencies && pluginList.length != 0) {
        console.log(`警告! 配置插件未安装， 请先安装插件`.yellow);
        return false;
    }
    if (pluginList.length == 0) {
        return true;
    }
    let isMatch = true;
    for (let i = 0, length = pluginList.length; i < length; i++) {
        let pluginName = pluginList[i];
        let targetVersion = dependencies[pluginName];
        let currentVersion = require(_path.join(file_config_1.default.pluginDir, pluginName, 'package.json')).version;
        if (targetVersion == currentVersion) {
            continue;
        }
        console.log(`警告！插件：${pluginName} 项目依赖版本是 ${targetVersion}，实际版本是 ${currentVersion}`);
        isMatch = false;
    }
    return isMatch;
}
exports.checkPluginVersion = checkPluginVersion;
