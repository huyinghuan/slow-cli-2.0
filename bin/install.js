"use strict";
const log_1 = require('../lib/log');
const _initUtils = require('../init/index');
const _plugin = require('../plugin/index');
const _ = require('lodash');
const _project = require('../project');
function default_1(_commander) {
    _commander.command('install [plugins...]')
        .description('安装插件')
        .option('-l, --log <value>', 'log日志,( 0[defaul]: show all; 1: show error, fail; 2: show error, fail, warn)', (value) => { log_1.default.setLevel(value); })
        .option('-p, --pluginListName <value>', '根据插件列表名称获取插件列表')
        .action((plugins, program) => {
        _initUtils.prepareUserEnv();
        let packageJSON = _project.getProjectPackageJSON();
        //如果指定了项目
        if (program.pluginListName) {
            _initUtils.getRemoteServerProjectPluginConfig(program.pluginListName, (pluginConfig) => {
                _plugin.writePluginConfigToConfigFile(pluginConfig);
                _plugin.install(Object.keys(pluginConfig));
            });
        }
        else if (plugins.length) {
            //写入到package.json
            let pluginConfig = {};
            plugins.forEach((pluginName) => {
                pluginConfig[_plugin.getFullPluginName(pluginName)] = {};
            });
            _plugin.writePluginConfigToConfigFile(pluginConfig);
            _plugin.install(plugins);
        }
        else {
            //没有指定，安装所有
            let pluginConfig = _plugin.getPluginConfig();
            let pluginNameArr = [];
            let versionDependencies = _project.getProjectPackageJSONField('dependencies');
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
                //获取依赖的版本,如果有依赖版本则安装以来版本
                if (versionDependencies[_plugin.getFullPluginName(key, false)]) {
                    key = `${key}@${version}`;
                }
                pluginNameArr.push(key);
            });
            _plugin.install(pluginNameArr);
        }
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
