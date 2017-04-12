"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _project = require("../project");
const _spawn = require("cross-spawn");
const log_1 = require("../lib/log");
const getFullPluginName_1 = require("./getFullPluginName");
const _registry = "http://npm.hunantv.com";
function installPlugin(beInstallPluginList, registry, saveAsProduct, cb) {
    if (registry == "taobao") {
        registry = "https://registry.npm.taobao.org";
    }
    let saveInfo = ["--save-dev", "--save-exact"];
    if (saveAsProduct) {
        saveInfo = ["--save", "--save-exact"];
    }
    registry = registry || _project.getProjectPackageJSONField('__registry') || _registry;
    var argvs = ["install", "--registry", registry].concat(beInstallPluginList).concat(saveInfo);
    let child = _spawn('npm', argvs, { stdio: 'inherit' });
    child.on('exit', function (code) {
        console.log(code);
        if (code == 0) {
            log_1.default.success(`安装插件${beInstallPluginList}成功`.green);
            cb(null);
        }
        else {
            cb(`安装插件${beInstallPluginList}失败`.red);
        }
    });
    child.on('error', function (e) {
        console.log(e);
        cb(`安装插件${beInstallPluginList}失败`.red);
    });
}
function default_1(pluginList, registry, saveAsDev, finish) {
    let beInstallPluginList = [];
    pluginList.forEach((pluginName) => {
        beInstallPluginList.push(getFullPluginName_1.default(pluginName, true));
    });
    installPlugin(beInstallPluginList, registry, saveAsDev, finish);
}
exports.default = default_1;
