"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _async = require("async");
const _project = require("../project");
const _spawn = require("cross-spawn");
const log_1 = require("../lib/log");
const getFullPluginName_1 = require("./getFullPluginName");
const public_1 = require("../public");
function installPlugin(beInstallPluginList, registry, saveAsProduct, cb) {
    if (registry == "taobao") {
        registry = "https://registry.npm.taobao.org";
    }
    if (registry == "npm") {
        registry = "https://registry.npmjs.com/";
    }
    registry = registry || _project.getProjectPackageJSONField('__registry') || public_1.default.private_npm_registry;
    let installSuccessPlugnList = [];
    let installFailPlugnList = [];
    _async.mapSeries(beInstallPluginList, (pluginName, doNext) => {
        let saveInfo = ["--save-dev", "--save-exact"];
        //所有非内容处理插件（即不以sp-开始的库，全部保存到正式依赖）
        if (pluginName.indexOf("sp-") != 0 || saveAsProduct) {
            saveInfo = ["--save", "--save-exact"];
        }
        let child = _spawn('npm', ["install", "--registry", registry].concat(pluginName).concat(saveInfo), { stdio: 'inherit' });
        child.on('exit', function (code) {
            if (code == 0) {
                log_1.default.success(`安装插件${pluginName}成功`.green);
                installSuccessPlugnList.push(pluginName);
                doNext(null, null);
            }
            else {
                installFailPlugnList.push(pluginName);
                doNext(null, null);
            }
        });
        child.on('error', function (e) {
            console.log(e);
            installFailPlugnList.push(pluginName);
            doNext(null, null);
        });
    }, (err) => {
        if (installSuccessPlugnList.length > 1) {
            log_1.default.success(`\n安装插件${installSuccessPlugnList}成功`.green);
        }
        if (installFailPlugnList.length) {
            cb(`\n安装插件${installFailPlugnList}失败`.red, installSuccessPlugnList);
        }
        else {
            cb(null, installSuccessPlugnList);
        }
    });
}
function default_1(pluginList, registry, saveAsProduct, finish) {
    let beInstallPluginList = [];
    pluginList.forEach((pluginName) => {
        beInstallPluginList.push(getFullPluginName_1.default(pluginName, true));
    });
    installPlugin(beInstallPluginList, registry, saveAsProduct, finish);
}
exports.default = default_1;
