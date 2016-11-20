"use strict";
const extraParamsParse_1 = require('./extraParamsParse');
const log_1 = require('../lib/log');
function default_1(_commander) {
    _commander.command('install <plugin> [plugins...]')
        .description('安装插件')
        .option('-l, --log <value>', 'log日志,( 0[defaul]: show all; 1: show error, fail; 2: show error, fail, warn)', (value) => { log_1.default.setLevel(value); })
        .option('-A, --additional <items>', '额外的参数，格式 -A A=1[,B=xxx]', extraParamsParse_1.default)
        .action((program, plugin, plugins) => {
        console.log(program, plugin, plugins);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
