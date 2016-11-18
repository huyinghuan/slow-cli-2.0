"use strict";
const _ = require('lodash');
const registerHook_1 = require('../hooks/registerHook');
const _utils = require('../hooks/utils');
const _init = require('../init/index');
const log_1 = require('../lib/log');
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
        if (options.__stop) {
            log_1.default.warn(`禁用插件${pluginName}`.red);
            return cb(null);
        }
        if (options.__source) {
            options = options.setting;
        }
        //默认权重
        if (_.isFunction(plugin.registerPlugin)) {
            plugin.registerPlugin({
                registerHook: (hookName, callback, priority) => {
                    if (hookName.indexOf(hookType) == 0 || hookType == 'all') {
                        registerHook_1.default(hookName, callback, priority);
                        if (pluginName) {
                            log_1.default.success(`加载插件${pluginName}'s hook ${hookName} 成功`.blue);
                        }
                        return;
                    }
                },
                options: _init.getFullConfig(),
                utils: _utils,
                log: log_1.default
            }, options);
        }
        cb(null);
    }
    catch (error) {
        log_1.default.fail(error);
        log_1.default.success(`加载插件 ${pluginName} 失败, 缺少注册函数`.red);
        cb(error);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = loadPlugin;
