"use strict";
const _path = require("path");
const config_filed_constant_1 = require("../config-filed-constant");
const getFullPluginName_1 = require("./getFullPluginName");
const _plugin = require("../plugin/index");
const loadPlugin_1 = require("./loadPlugin");
const getAllFileInDir_1 = require("../lib/getAllFileInDir");
const log_1 = require("../lib/log");
//扫描加载内置插件
function scanDefaultPlugins(hookType) {
    //指定类型的hook
    let hookTypePluginDir = _path.join(__dirname, "default-plugin", hookType);
    let pluginArray = getAllFileInDir_1.default(hookTypePluginDir, [], ".", (fileName, filePath) => { return true; });
    //通用的类型的hook
    let commonHookTypePlugiDir = _path.join(__dirname, "default-plugin", 'commom');
    let commonPluginArray = getAllFileInDir_1.default(commonHookTypePlugiDir, [], ".", (fileName, filePath) => { return true; });
    let allPlugin = pluginArray.concat(commonPluginArray);
    allPlugin.forEach((pluginItem) => {
        loadPlugin_1.default(hookType, "", pluginItem.filePath, {});
    });
}
//获取开发中的插件实际位置
function getDevPluginPath(source) {
    if (!source) {
        return "";
    }
    //是否为绝对路径
    if (_path.isAbsolute(source)) {
        return source;
    }
    //是否设置了根目录 没有设置 取执行目录为根目录
    let pluginRootDir = _plugin.getPluginConfig().__root || process.cwd();
    return _path.join(pluginRootDir, source);
}
/**
 * 扫描Hooks插件, 仅加载指定hook
*/
function scanPlugins(hookType) {
    let configFiledConstant = config_filed_constant_1.default.get();
    let __startTime = Date.now();
    let pluginsConfig = _plugin.getPluginConfig();
    if (!pluginsConfig) {
        console.log(`没有配置任何插件`.red);
        return;
    }
    let plugins = [];
    let pluginExts = [];
    Object.keys(pluginsConfig).forEach((key) => {
        if (/^(__)/.test(key)) {
            return;
        }
        if (/(\-ext)$/.test(key)) {
            pluginExts.push(key);
        }
        else {
            plugins.push(key);
        }
    });
    //插件扩展优先加载，使得调用注册插件时，可以灵活使用。
    plugins = pluginExts.concat(plugins);
    plugins.forEach((pluginName) => {
        if (!pluginsConfig[pluginName]) {
            console.log(`插件 ${pluginName} 已被禁用`.red);
            return;
        }
        if (pluginsConfig[pluginName].__source) {
            console.log(`警告！！ ${pluginName} 加载方式为 开发者模式`.red);
        }
        //从自定义路径或插件目录获取插件路径
        let pluginPath = getDevPluginPath(pluginsConfig[pluginName].__source) || _path.join(configFiledConstant.pluginDir, getFullPluginName_1.default(pluginName));
        let __loadStart = Date.now();
        loadPlugin_1.default(hookType, pluginName, pluginPath, pluginsConfig[pluginName]);
        log_1.default.info(`加载 ${pluginName} 用时 ${Date.now() - __loadStart}ms`);
    });
    log_1.default.info(`加载插件用时 ${Date.now() - __startTime}ms`);
    //内置插件
    scanDefaultPlugins(hookType);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = scanPlugins;
