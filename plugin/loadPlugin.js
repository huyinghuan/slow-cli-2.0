"use strict";
const _ = require('lodash');
const registerHook_1 = require('../hooks/registerHook');
const registerHookExt_1 = require('../hooks/registerHookExt');
const _utils = require('../hooks/utils');
const _init = require('../init/index');
const log_1 = require('../lib/log');
const _hookMap = require('../hooks/map');
/**
 * 加载指定类型hooks
 * hookType  hook类型，如start只用到了route 类型， build只用了build类型， 加载所有用 all
 * pluginName 插件名字
 * pluginPath 插件路径
 * option 插件配置
 *  */
function loadPlugin(hookType, pluginName, pluginPath, options) {
    try {
        if (_.isPlainObject(options)) {
            if (options.__stop) {
                log_1.default.warn(`禁用插件${pluginName}`.red);
                return;
            }
            if (options.__source) {
                options = options.__setting;
            }
        }
        let plugin = require(pluginPath);
        //默认权重 加载插件
        if (_.isFunction(plugin.registerPlugin)) {
            plugin.registerPlugin({
                registerHook: (hookName, callback, priority) => {
                    if (hookName.indexOf(hookType) == 0 || hookType == 'all') {
                        priority = ~~priority > 0 ? ~~priority : 1;
                        registerHook_1.default(hookName, callback, priority);
                        if (pluginName) {
                            log_1.default.success(`加载插件${pluginName}'s hook ${hookName} 成功`.blue);
                        }
                        return;
                    }
                },
                ext: _hookMap.HookExtQueue,
                options: _init.getFullConfig(),
                utils: _utils,
                log: log_1.default
            }, options);
        }
        if (_.isFunction(plugin.registerPluginExt)) {
            plugin.registerPluginExt({
                registerExt: (extName, fn) => {
                    registerHookExt_1.default(extName, fn);
                    log_1.default.success(`加载插件扩展 ${extName} 成功`.blue);
                },
                options: _init.getFullConfig(),
                utils: _utils,
                log: log_1.default
            }, options);
        }
    }
    catch (error) {
        log_1.default.fail(error);
        log_1.default.success(`加载插件 ${pluginName} 失败, 缺少注册函数`.red);
        process.exit(1);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = loadPlugin;
