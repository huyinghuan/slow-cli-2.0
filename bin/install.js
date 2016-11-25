"use strict";
const log_1 = require('../lib/log');
const _initUtils = require('../init/index');
const _plugin = require('../plugin/index');
const _ = require('lodash');
function default_1(_commander) {
    _commander.command('install [plugins...]')
        .description('安装插件')
        .option('-l, --log <value>', 'log日志,( 0[defaul]: show all; 1: show error, fail; 2: show error, fail, warn)', (value) => { log_1.default.setLevel(value); })
        .option('-p, --pluginListName <value>', '根据插件列表名称获取插件列表')
        .action((plugins, program) => {
        _initUtils.prepareUserEnv();
        let packageJSON = _initUtils.getProjectPackageJSON();
        //如果指定了项目
        if (program.pluginListName) {
            _initUtils.getRemoteServerProjectPluginConfig(program.pluginListName, (pluginConfig) => {
                _initUtils.writePluginConfigToConfigFile(pluginConfig);
                _plugin.install(Object.keys(pluginConfig));
            });
        }
        else if (plugins.length) {
            //写入到package.json
            let pluginConfig = {};
            plugins.forEach((pluginName) => {
                pluginConfig[_plugin.getFullPluginName(pluginName)] = {};
            });
            _initUtils.writePluginConfigToConfigFile(pluginConfig);
            _plugin.install(plugins);
        }
        else {
            //没有指定，安装所有
            let pluginConfig = _initUtils.getPluginConfig();
            let pluginNameArr = [];
            Object.keys(pluginConfig).forEach((key) => {
                if (pluginConfig[key] == false) {
                    log_1.default.info(`插件${key}已被禁用， 跳过安装`);
                    return;
                }
                if (_.isPlainObject(pluginConfig[key]) && pluginConfig[key].__source) {
                    log_1.default.info(`插件${key}处于开发中模式， 跳过安装`);
                    return;
                }
                pluginNameArr.push(key);
            });
            _plugin.install(pluginNameArr);
        }
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
