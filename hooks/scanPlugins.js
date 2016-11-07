"use strict";
const _ = require('lodash');
const _path = require('path');
const _async = require('async');
const file_config_1 = require('../file-config');
const registerHook_1 = require('./registerHook');
/**加载hooks */
function loadPlugin(pluginName, pluginPath, options, cb) {
    try {
        let plugin = require(pluginPath);
        //默认权重
        if (_.isFunction(plugin.registerPlugin)) {
            plugin.registerPlugin({
                registerHook: registerHook_1.default,
                options: global.__CLI
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
//获取插件完成名称
function getPluginFullName(pluginName) {
    return pluginName;
}
/**
 * 扫描Hooks插件
*/
function scanPlugins(cb) {
    let pluginsConfig = global.__CLI.pluginConfig;
    if (!pluginsConfig) {
        console.log(`没有配置任何插件`.red);
        return cb(null);
    }
    let plugins = Object.keys(pluginsConfig);
    _async.map(plugins, (pluginName, next) => {
        if (!pluginsConfig[pluginName]) {
            console.log(`插件 ${pluginName} 已被禁用`.red);
        }
        if (pluginsConfig[pluginName].source) {
            console.log(`警告！！ ${pluginName} 加载方式为 开发者模式`.red);
        }
        //从自定义路径或插件目录获取插件路径
        let pluginPath = pluginsConfig[pluginName].source || _path.join(file_config_1.default.pluginDir, pluginName);
        loadPlugin(pluginName, pluginPath, pluginsConfig[pluginName], next);
    }, (error) => {
        cb(error);
    });
}
exports.scanPlugins = scanPlugins;
