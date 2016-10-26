"use strict";
const _ = require('lodash');
const _path = require('path');
const _async = require('async');
const index_1 = require('../index');
const config_1 = require('../config');
const map_1 = require('./map');
var HookQueue = {};
function triggerHook(hookName, callback) { }
exports.triggerHook = triggerHook;
/**
  触发RouterHook, 可用于自定义路由操作
*/
function triggerRouterHook(router, callback) {
    let queue = HookQueue[map_1.default.route.initial];
    _async;
}
exports.triggerRouterHook = triggerRouterHook;
/**
 * 注册hooks
 */
function registerHook(hookName, callback) {
    if (!HookQueue[hookName]) {
        HookQueue[hookName] = [];
    }
    //加入hook队列
    HookQueue[hookName].push({ callback });
    console.log(`加载插件${hookName}成功`.blue);
}
exports.registerHook = registerHook;
//将插件加入到队列等待排序
function addHooksToQueue() {
}
/**
 * 扫描Hooks插件
*/
function scanPlugins() {
    //读取工程目录下package.json配置
    let packageJSON = require(_path.join(process.cwd(), 'package.json'));
    let pluginsConfig = packageJSON[config_1.default.pluginInfo.name];
    let plugins = Object.keys(pluginsConfig);
    for (let i = 0, len = plugins.length; i < len; i++) {
        let pluginName = plugins[i];
        //从源文件加载插件或者从 插件目录加载插件
        let pluginPath = pluginsConfig[pluginName].source || _path.join(config_1.default.pluginDir, pluginName);
        loadPlugin(pluginName, pluginPath, pluginsConfig);
    }
}
exports.scanPlugins = scanPlugins;
/**从源文件加载hooks */
function loadPlugin(pluginName, pluginPath, options) {
    try {
        let plugin = require(options.source);
        //默认权重
        plugin.priority = plugin.priority ? ~~plugin.priority : 1;
        if (_.isFunction(plugin.registerPlugin)) {
            plugin.registerPlugin(index_1.default, options);
        }
    }
    catch (error) {
        console.log(`加载插件 ${pluginName} 失败, 缺少注册函数 `.red);
    }
}
exports.loadPlugin = loadPlugin;
