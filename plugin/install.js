"use strict";
const _project = require("../project");
const executeCommand_1 = require("../lib/executeCommand");
const log_1 = require("../lib/log");
const getFullPluginName_1 = require("./getFullPluginName");
const _registry = "http://npm.hunantv.com";
function installPlugin(pluginName, cb) {
    let registry = _project.getProjectPackageJSONField('__registry') || _registry;
    console.log(`npm install ${pluginName}  --save --save-exact --registry ${registry}`);
    executeCommand_1.default(`npm install ${pluginName} --save --save-exact --registry ${registry}`, (error) => {
        if (error) {
            cb(`安装插件${pluginName}失败`.red);
        }
        else {
            log_1.default.success(`安装插件${pluginName}成功`.green);
            cb(null);
        }
    });
}
function default_1(pluginList) {
    let beInstallPluginList = [];
    pluginList.forEach((pluginName) => {
        beInstallPluginList.push(getFullPluginName_1.default(pluginName, true));
    });
    installPlugin(beInstallPluginList.join(' '), (error) => {
        if (error) {
            log_1.default.error(error);
        }
        log_1.default.success("安装插件完成！".green);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
