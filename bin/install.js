"use strict";
const extraParamsParse_1 = require('./extraParamsParse');
const log_1 = require('../lib/log');
const _initUtils = require('../init/index');
const _plugin = require('../plugin/index');
function default_1(_commander) {
    _commander.command('install [plugins...]')
        .description('安装插件')
        .option('-l, --log <value>', 'log日志,( 0[defaul]: show all; 1: show error, fail; 2: show error, fail, warn)', (value) => { log_1.default.setLevel(value); })
        .option('-A, --additional <items>', '额外的参数，格式 -A A=1[,B=xxx]', extraParamsParse_1.default)
        .option('-p, --pluginListName <value>', '根据插件列表名称获取插件列表')
        .action((plugins, program) => {
        console.log(plugins);
        let queue = [];
        let pluginConfig = {};
        plugins.forEach((pluginName) => {
            pluginConfig[_plugin.getFullPluginName(pluginName)] = {};
        });
        if (program.pluginListName) {
            queue.push(() => {
                _initUtils.getRemoteServerProjectPluginConfig(program.pluginListName, (pluginConfig) => {
                });
            });
        }
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
