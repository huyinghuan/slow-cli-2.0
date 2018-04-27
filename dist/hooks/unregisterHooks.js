"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 注销所有hooks
 */
const _hookMap = require("./map");
const config_filed_constant_1 = require("../config-filed-constant");
function default_1() {
    Object.keys(_hookMap.HookQueue).forEach((key) => {
        delete _hookMap.HookQueue[key];
    });
    Object.keys(_hookMap.HookExtQueue).forEach((key) => {
        delete _hookMap.HookQueue[key];
    });
    //清空require缓存
    let pluginConfig = config_filed_constant_1.default.getPluginConfig();
    let pluginNameList = [];
    Object.keys(pluginConfig).forEach((key) => {
        if (key.indexOf('srp') == 0) {
            pluginNameList.push(key);
        }
    });
    pluginNameList.push(".silky");
    Object.keys(require.cache).forEach((cacheKey) => {
        pluginNameList.forEach((pluginName) => {
            if (cacheKey.indexOf(pluginName) != -1) {
                delete require.cache[cacheKey];
            }
        });
    });
}
exports.default = default_1;
