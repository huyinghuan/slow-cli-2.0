"use strict";
const log_1 = require("../lib/log");
const _initUtils = require("../init/index");
const _plugin = require("../plugin/index");
const _ = require("lodash");
const _project = require("../project");
const _init = require("../init/index");
const config_filed_constant_1 = require("../config-filed-constant");
function execute(plugins, program, finish) {
    //读取用户自定义配置
    _init.prepareUserEnv(program.workspace);
    let packageJSON = _project.getProjectPackageJSON();
    let saveAsProduct = program.save;
    //如果指定了项目
    /* istanbul ignore if  */
    if (program.pluginListName) {
        _initUtils.getRemoteServerProjectPluginConfig(program.pluginListName, (pluginConfig) => {
            _plugin.writePluginConfigToConfigFile(pluginConfig);
            _plugin.install(Object.keys(pluginConfig), program.registry, saveAsProduct, finish);
        });
    }
    else if (plugins.length) {
        //写入到package.json
        let pluginConfig = {};
        plugins.forEach((pluginName) => {
            pluginConfig[_plugin.getFullPluginName(pluginName)] = _plugin.getPluginConfig(pluginName);
        });
        _plugin.writePluginConfigToConfigFile(pluginConfig);
        _plugin.install(plugins, program.registry, saveAsProduct, finish);
    }
    else {
        //没有指定，安装所有
        let pluginConfig = config_filed_constant_1.default.getPluginConfig();
        let pluginNameArr = [];
        let versionDependencies = _project.getProjectPackageJSONField('dependencies') || _project.getProjectPackageJSONField('dev-dependencies') || {};
        Object.keys(pluginConfig).forEach((key) => {
            if (pluginConfig[key] == false) {
                log_1.default.info(`插件${key}已被禁用， 跳过安装`);
                return;
            }
            if (_.isPlainObject(pluginConfig[key]) && pluginConfig[key].__source) {
                log_1.default.info(`插件${key}处于开发中模式， 跳过安装`);
                return;
            }
            let version = versionDependencies[_plugin.getFullPluginName(key, false)];
            let hadInstalledVersion = _plugin.getInstalledPluginVersion(_plugin.getFullPluginName(key, false));
            if (version == hadInstalledVersion && !program.force) {
                return console.log(`插件${key}已安装规定版本${version}`);
            }
            //获取依赖的版本,如果有依赖版本则安装依赖版本
            if (versionDependencies[_plugin.getFullPluginName(key, false)]) {
                key = `${key}@${version}`;
            }
            pluginNameArr.push(key);
        });
        if (pluginNameArr.length == 0) {
            return console.log('所有依赖已全部安装。');
        }
        _plugin.install(pluginNameArr, program.registry, saveAsProduct, finish);
    }
}
exports.execute = execute;
/* istanbul ignore next  */
function commander(_commander) {
    _commander.command('install [plugins...]')
        .description('安装插件')
        .option('-w, --workspace <value>', '指定工作目录')
        .option('-l, --log <value>', 'log日志,( 0[defaul]: show all; 1: show error, fail; 2: show error, fail, warn)', (value) => { log_1.default.setLevel(value); })
        .option('-p, --pluginListName <value>', '根据插件列表名称获取插件列表')
        .option('-f, --force', '强制重新安装')
        .option('-r, --registry <value>', "指定插件的仓库地址")
        .option('-s, --save', '以产品模式安装插件，用于开发js css lib 库')
        .action((plugins, program) => {
        execute(plugins, program, (error) => {
            if (error) {
                log_1.default.error(error);
            }
            log_1.default.success("安装插件完成！".green);
        });
    });
}
exports.commander = commander;
