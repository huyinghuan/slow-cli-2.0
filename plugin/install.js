"use strict";
const _project = require("../project");
const executeCommand_1 = require("../lib/executeCommand");
const log_1 = require("../lib/log");
const getFullPluginName_1 = require("./getFullPluginName");
const config_filed_constant_1 = require("../config-filed-constant");
const _registry = "http://npm.hunantv.com";
function installPlugin(pluginName, registry, cb) {
    registry = registry || _project.getProjectPackageJSONField('__registry') || _registry;
    console.log(`npm install ${pluginName}  --save --save-exact --registry ${registry}`);
    executeCommand_1.default(`npm install ${pluginName} --save --save-exact --registry ${registry}`, { cwd: config_filed_constant_1.default.getWorkspace() }, (error) => {
        if (error) {
            cb(`安装插件${pluginName}失败`.red);
            cb(error);
        }
        else {
            log_1.default.success(`安装插件${pluginName}成功`.green);
            cb(null);
        }
    });
}
function default_1(pluginList, registry, finish) {
    let beInstallPluginList = [];
    pluginList.forEach((pluginName) => {
        beInstallPluginList.push(getFullPluginName_1.default(pluginName, true));
    });
    installPlugin(beInstallPluginList.join(' '), registry, finish);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
