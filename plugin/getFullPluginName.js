"use strict";
//获取插件完成名称
function default_1(pluginName, needVersion) {
    let pluginStrArray = pluginName.split('@');
    pluginName = pluginStrArray[0];
    let version = pluginStrArray[1];
    if (!/^(sp\-)/.test(pluginName)) {
        pluginName = `sp-${pluginName}`;
    }
    return (needVersion && version) ? `${pluginName}@${version}` : pluginName;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
