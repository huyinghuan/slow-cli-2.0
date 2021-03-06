"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _init = require("../init/index");
const _project = require("../project");
const _fse = require("fs-extra");
const config_filed_constant_1 = require("../config-filed-constant");
function changeToDev(root, pluginConfig, plugins) {
    if (plugins && plugins.length) {
        plugins.forEach(pluginName => {
            let item = pluginConfig[pluginName];
            if (item) {
                pluginConfig[pluginName] = {
                    __stop: false,
                    __source: pluginName,
                    __setting: item
                };
            }
        });
        return pluginConfig;
    }
    let newPluginConfig = { __root: root };
    Object.keys(pluginConfig).forEach((key) => {
        if (key.indexOf('__') == 0) {
            return;
        }
        newPluginConfig[key] = {
            __stop: false,
            __source: key,
            __setting: pluginConfig[key]
        };
    });
    return newPluginConfig;
}
function changeToProduction(pluginConfig) {
    let newPluginConfig = {};
    Object.keys(pluginConfig).forEach((key) => {
        if (key.indexOf('__') == 0) {
            return;
        }
        if (pluginConfig[key].__source) {
            newPluginConfig[key] = pluginConfig[key].__setting || {};
        }
        else {
            newPluginConfig[key] = pluginConfig[key];
        }
    });
    return newPluginConfig;
}
function execute(plugins, program) {
    //读取用户自定义配置
    _init.prepareUserEnv(program.workspace);
    let packageJSON = _project.getProjectPackageJSON();
    let configFiledConstant = config_filed_constant_1.default.get();
    let pluginConfig = packageJSON[configFiledConstant.pluginConfigField];
    let newPluginConfig = null;
    if (!program.root) {
        program.root = "/";
    }
    if (program.production) {
        newPluginConfig = changeToProduction(pluginConfig);
    }
    else {
        newPluginConfig = changeToDev(program.root, pluginConfig, plugins);
    }
    packageJSON[configFiledConstant.pluginConfigField] = newPluginConfig;
    _fse.writeJSONSync(configFiledConstant.CLIConfigFile, packageJSON);
}
exports.execute = execute;
/* istanbul ignore next  */
function commander(_commander) {
    _commander.command('dev [plugins...]')
        .description('开发插件和正式插件的相互转化')
        .option('-w, --workspace <value>', '指定工作目录')
        .option('-p, --production', "转成正式环境")
        .option('-n, --name <value>', "开发某个插件")
        .option('-r, --root <value>', "插件根目录")
        .action(execute);
}
exports.commander = commander;
