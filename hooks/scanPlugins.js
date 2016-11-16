"use strict";
const _path = require('path');
const _async = require('async');
const file_config_1 = require('../file-config');
const getFullPluginName_1 = require('./getFullPluginName');
const _init = require('../init/index');
const loadPlugin_1 = require('./loadPlugin');
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
            return cb(null);
        }
        if (pluginsConfig[pluginName].source) {
            console.log(`警告！！ ${pluginName} 加载方式为 开发者模式`.red);
        }
        //从自定义路径或插件目录获取插件路径
        let pluginPath = pluginsConfig[pluginName].source || _path.join(file_config_1.default.pluginDir, getFullPluginName_1.default(pluginName));
        loadPlugin_1.default(hookType, pluginName, pluginPath, pluginsConfig[pluginName], next);
    }, (error) => {
        cb(error);
    });
}
exports.scanPlugins = scanPlugins;
