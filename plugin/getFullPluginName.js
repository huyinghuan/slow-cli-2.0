"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//获取插件完成名称
function default_1(pluginName, needVersion) {
    let pluginStrArray = pluginName.split('@');
    pluginName = pluginStrArray[0];
    let version = pluginStrArray[1];
    return (needVersion && version) ? `${pluginName}@${version}` : pluginName;
}
exports.default = default_1;
