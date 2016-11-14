"use strict";
const _ = require('lodash');
const _path = require('path');
const _async = require('async');
const file_config_1 = require('../file-config');
const registerHook_1 = require('./registerHook');
const getFullPluginName_1 = require('./getFullPluginName');
const _init = require('../init/index');
const _utils = require('./utils');
/**
 * 加载指定类型hooks
 * hookType  hook类型，如start只用到了route 类型， build只用了build类型， 加载所有用 all
 * pluginName 插件名字
 * pluginPath 插件路径
 * option 插件配置
 * cb 回调函数
 *  */
function loadPlugin(hookType, pluginName, pluginPath, options, cb) {
    try {
        let plugin = require(pluginPath);
        //默认权重
        if (_.isFunction(plugin.registerPlugin)) {
            plugin.registerPlugin({
                registerHook: (hookName, callback, priority) => {
                    if (hookName.indexOf(hookType) == 0 || hookType == 'all') {
                        registerHook_1.default(hookName, callback, priority);
                        console.log(`加载插件${pluginName}'s hook ${hookName} 成功`.blue);
                        return;
                    }
                },
                options: _init.getFullConfig(),
                utils: _utils //一些默认工具函数，大多插件可以使用得到
            }, options);
        }
        cb(null);
    }
    catch (error) {
        console.log(error);
        console.log(`加载插件 ${pluginName} 失败, 缺少注册函数`.red);
        cb(error);
    }
}
exports.loadPlugin = loadPlugin;
/**
 * 扫描Hooks插件, 仅加载指定hook
*/
function scanPlugins(hookType, cb) {
    let pluginsConfig = _init.getPluginConfig();
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
        let pluginPath = pluginsConfig[pluginName].source || _path.join(file_config_1.default.pluginDir, getFullPluginName_1.default(pluginName));
        loadPlugin(hookType, pluginName, pluginPath, pluginsConfig[pluginName], next);
    }, (error) => {
        cb(error);
    });
}
exports.scanPlugins = scanPlugins;
