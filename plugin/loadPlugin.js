"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const registerHook_1 = require("../hooks/registerHook");
const registerHookExt_1 = require("../hooks/registerHookExt");
const _utils = require("../hooks/utils");
const log_1 = require("../lib/log");
const _hookMap = require("../hooks/map");
const _runtime = require("../runtime-enviroment/index");
const config_filed_constant_1 = require("../config-filed-constant");
const _path = require("path");
const _fs = require("fs");
function registerHook(hookType, pluginName) {
    return (hookName, callback, priority) => {
        if (hookName.indexOf(hookType) == 0 || hookType == 'all') {
            priority = ~~priority > 0 ? ~~priority : 1;
            registerHook_1.default(hookName, callback, priority);
            if (pluginName) {
                log_1.default.success(`加载插件${pluginName}'s hook  ${hookName} 成功! priority:${priority}`.blue);
            }
            return;
        }
    };
}
function getWorkspace() {
    return config_filed_constant_1.default.getWorkspace();
}
function getPublicLibIndex(moduleName) {
    let pubModulesDir = config_filed_constant_1.default.getGlobal().pubModulesDir;
    let moduleRootAbsolute = _path.join(config_filed_constant_1.default.getWorkspace(), pubModulesDir, moduleName);
    let packageJSON = require(_path.join(moduleRootAbsolute, "package.json"));
    let index = packageJSON.index;
    if (index) {
        return index;
    }
    let files = _fs.readdirSync(moduleRootAbsolute);
    for (let i = 0, len = files.length; i < len; i++) {
        if (/^index\./.test(files[i])) {
            index = files[i];
            break;
        }
    }
    return index;
}
function getPublicLibDir(moduleName) {
    let pubModulesDir = config_filed_constant_1.default.getGlobal().pubModulesDir;
    return _path.join(pubModulesDir, moduleName);
}
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
                registerHook: registerHook(hookType, pluginName),
                ext: _hookMap.HookExtQueue,
                options: config_filed_constant_1.default.getGlobal(),
                utils: _utils,
                log: log_1.default,
                cwd: getWorkspace,
                getPublicLibIndex: getPublicLibIndex,
                getPublicLibDir: getPublicLibDir,
                runtime: _runtime
            }, options);
        }
        if (_.isFunction(plugin.registerPluginExt)) {
            plugin.registerPluginExt({
                registerExt: (extName, fn) => {
                    registerHookExt_1.default(extName, fn);
                    log_1.default.success(`加载插件扩展 ${extName} 成功`.blue);
                },
                options: config_filed_constant_1.default.getGlobal(),
                utils: _utils,
                log: log_1.default,
                cwd: getWorkspace,
            }, options);
        }
    }
    catch (error) {
        log_1.default.fail(error);
        log_1.default.error(`加载插件 ${pluginName} 失败`.red);
        process.exit(1);
    }
}
exports.default = loadPlugin;
