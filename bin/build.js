"use strict";
const _init = require('../init/index');
const build_1 = require('../build');
const _project = require('../project');
const _plugin = require('../plugin/index');
const extraParamsParse_1 = require('./extraParamsParse');
const log_1 = require('../lib/log');
function default_1(_commander) {
    _commander.command('build')
        .description('编译')
        .option('-o, --outdir <value>', '指定build文件夹')
        .option('-f, --force', '强制进行build，哪怕版本检查没通过')
        .option('-l, --log <value>', 'log日志,( 0[defaul]: show all; 1: show error, fail; 2: show error, fail, warn)', (value) => { log_1.default.setLevel(value); })
        .option('-A, --additional <items>', '额外的参数，格式 -A A=1[,B=xxx] 或者指定唯一值  -A value', extraParamsParse_1.default)
        .allowUnknownOption()
        .action((program) => {
        //读取用户自定义配置
        _init.prepareUserEnv();
        //build 强制进行版本检查
        let checkResult = _project.checkCLIVersion() && _plugin.checkPluginVersion();
        //如没有强制build项目，那么如果版本检查没通过则结束build
        if (!program.force && !checkResult) {
            process.exit(1);
        }
        //运行时参数记录
        let userInputArgs = {};
        //制定编译输出目录
        if (program.outdir) {
            userInputArgs.outdir = program.outdir;
        }
        //更新全局变量下的编译参数。
        _init.setBuildParams(userInputArgs);
        if (program.additional) {
            _init.setBuildParams(program.additional);
        }
        //检查编译参数
        if (!_init.checkBuildArgs()) {
            return process.exit(1);
        }
        build_1.default();
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
