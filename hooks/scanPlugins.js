"use strict";
const _ = require('lodash');
const _path = require('path');
const _async = require('async');
const config_1 = require('../config');
const registerHook_1 = require('./registerHook');
/**加载hooks */
function loadPlugin(pluginName, pluginPath, options, cb) {
    try {
        let plugin = require(pluginPath);
        //默认权重
        if (_.isFunction(plugin.registerPlugin)) {
            plugin.registerPlugin({
                registerHook: registerHook_1.default,
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
/**
 * 扫描Hooks插件
*/
function scanPlugins(cb) {
    //读取工程目录下package.json配置
    let packageJSON = require(_path.join(process.cwd(), 'package.json'));
    let pluginsConfig = packageJSON[config_1.default.pluginInfo.name];
    if (!pluginsConfig) {
        console.log(`没有配置任何插件`.red);
        return cb(null);
    }
    let plugins = Object.keys(pluginsConfig);
    _async.map(plugins, (pluginName, next) => {
        if (!pluginsConfig[pluginName]) {
            console.log(`插件 ${pluginName} 已被禁用`.red);
        }
        //从自定义路径或插件目录获取插件路径
        let pluginPath = pluginsConfig[pluginName].source || _path.join(config_1.default.pluginDir, pluginName);
        loadPlugin(pluginName, pluginPath, pluginsConfig[pluginName], next);
    }, (error) => {
        cb(error);
    });
}
exports.scanPlugins = scanPlugins;
