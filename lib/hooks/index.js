"use strict";
const _ = require('lodash');
const _path = require('path');
const _async = require('async');
const config_1 = require('../config');
const map_1 = require('./map');
//坑 import * as _colors from 'colors';
require('colors');
var HookQueue = {};
function triggerHook(hookName, callback) { }
exports.triggerHook = triggerHook;
/**
*触发RouterHook, 可用于自定义路由操作
* 返回 true 停止其他hook，
* 返回 false 使用其他hook
*/
function triggerRouterHook(router) {
    let queue = HookQueue[map_1.default.route.initial];
    for (let i = 0, length = queue.length; i < length; i++) {
        if (queue[i].fn(router)) {
            return true;
        }
    }
    return false;
}
exports.triggerRouterHook = triggerRouterHook;
/**
 * 注册hooks
 * priority  优先级
 */
function registerHook(hookName, callback, priority) {
    priority = ~~priority ? ~~priority : 1;
    if (!HookQueue[hookName]) {
        HookQueue[hookName] = [];
    }
    //加入hook队列
    HookQueue[hookName].push({ fn: callback, priority: priority });
    //排序
    sortHook(hookName);
}
exports.registerHook = registerHook;
//排序
function sortHook(hookName) {
    HookQueue[hookName] = _.orderBy(HookQueue[hookName], 'priority', 'desc');
}
/**
 * 扫描Hooks插件
*/
function scanPlugins(cb) {
    //读取工程目录下package.json配置
    let packageJSON = require(_path.join(process.cwd(), 'package.json'));
    let pluginsConfig = packageJSON[config_1.default.pluginInfo.name];
    let plugins = Object.keys(pluginsConfig);
    _async.map(plugins, (pluginName, next) => {
        //从自定义路径或插件目录获取插件路径
        let pluginPath = pluginsConfig[pluginName].source || _path.join(config_1.default.pluginDir, pluginName);
        loadPlugin(pluginName, pluginPath, pluginsConfig[pluginName], next);
    }, (error) => {
        cb(error);
    });
}
exports.scanPlugins = scanPlugins;
/**加载hooks */
function loadPlugin(pluginName, pluginPath, options, cb) {
    try {
        let plugin = require(pluginPath);
        //默认权重
        if (_.isFunction(plugin.registerPlugin)) {
            plugin.registerPlugin({
                registerHook: registerHook,
                __CLI: global.__CLI
            }, options);
        }
        console.log(`加载插件${pluginName}成功`.blue);
        cb(null);
    }
    catch (error) {
        console.log(error);
        console.log(`加载插件 ${pluginName} 失败, 缺少注册函数`.red);
        cb(error);
    }
}
exports.loadPlugin = loadPlugin;
