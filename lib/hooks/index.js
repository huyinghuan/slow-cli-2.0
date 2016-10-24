"use strict";
const _ = require('lodash');
var HookQueue = {};
function triggerHook(hookName, callback) { }
exports.triggerHook = triggerHook;
/**
  触发RouterHook, 可用于自定义路由操作
*/
function triggerRouterHook(router, callback) {
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
    HookQueue[hookName].push(callback);
    console.log(`加载插件${hookName}成功`.blue);
}
exports.registerHook = registerHook;
function sortHook() {
    //hooks排序
    Object.keys(HookQueue).forEach((key) => {
        HookQueue[key] = _.sortBy(HookQueue[key], ['priority'], ['desc']);
    });
}
exports.sortHook = sortHook;
/**
 * 扫描Hooks插件
*/
function scanPlugins() {
}
exports.scanPlugins = scanPlugins;
/**从源文件加载hooks */
function loadPluginFromSource(pluginName, soucre) {
}
exports.loadPluginFromSource = loadPluginFromSource;
/**
 * 从 ~/.xxx/node_modules
 */
function loadPluginFromNodeModules(pluginName) {
}
exports.loadPluginFromNodeModules = loadPluginFromNodeModules;
