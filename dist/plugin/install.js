"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _project = require("../project");
const _spawn = require("cross-spawn");
const log_1 = require("../lib/log");
const getFullPluginName_1 = require("./getFullPluginName");
const public_1 = require("../public");
const _ = require("lodash");
function logSuccessInfo(installSuccessPlugnList) {
    let versionDependencies = _.extend({}, _project.getProjectPackageJSONField('devDependencies'), _project.getProjectPackageJSONField('dependencies'));
    log_1.default.success(`\n已成功安装插件:`.yellow);
    installSuccessPlugnList.forEach((pluginNameAndVersion) => {
        let pluginName = pluginNameAndVersion.replace(/\@.+$/, "");
        log_1.default.success(`  ${pluginName}@${versionDependencies[pluginName]}`.yellow);
    });
}
function npmInstall(registry, pluginName) {
    return new Promise((reslove, reject) => {
        let child = _spawn('npm', ["install", "--registry", registry].concat(pluginName).concat(["--save", "--save-exact"]), { stdio: 'inherit' });
        child.on('exit', function (code) {
            if (code == 0) {
                log_1.default.success(`安装插件${pluginName}成功`.green);
                reslove(true);
            }
            else {
                reslove(false);
            }
        });
        child.on('error', function (e) {
            reject(e);
        });
    });
}
function installPlugin(beInstallPluginList, registry) {
    return __awaiter(this, void 0, void 0, function* () {
        if (registry == "taobao") {
            registry = "https://registry.npm.taobao.org";
        }
        if (registry == "npm") {
            registry = "https://registry.npmjs.com/";
        }
        registry = registry || _project.getProjectPackageJSONField('__registry') || public_1.default.private_npm_registry;
        let installSuccessPlugnList = [];
        let installFailPlugnList = [];
        beInstallPluginList.forEach((pluginName) => __awaiter(this, void 0, void 0, function* () {
            if (pluginName.indexOf('@') == -1) {
                pluginName = pluginName + "@latest";
            }
            let success = yield npmInstall(registry, pluginName);
            if (success) {
                installSuccessPlugnList.push(pluginName);
            }
            else {
                installFailPlugnList.push(pluginName);
            }
        }));
        if (installSuccessPlugnList.length > 1) {
            logSuccessInfo(installSuccessPlugnList);
        }
        if (installFailPlugnList.length) {
            return {
                err: `\n安装插件${installFailPlugnList}失败`,
                list: installSuccessPlugnList
            };
        }
        return {
            list: installSuccessPlugnList
        };
    });
}
function default_1(pluginList, registry) {
    return __awaiter(this, void 0, void 0, function* () {
        let beInstallPluginList = [];
        pluginList.forEach((pluginName) => {
            beInstallPluginList.push(getFullPluginName_1.default(pluginName, true));
        });
        return installPlugin(beInstallPluginList, registry);
    });
}
exports.default = default_1;
