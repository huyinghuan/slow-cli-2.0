"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _init = require("../init/index");
const _cli = require("../cli");
const _utils = require("../plugin/index");
const log_1 = require("../lib/log");
const config_filed_constant_1 = require("../config-filed-constant");
const _precompile = require("../precompile");
function prepare(program) {
    //读取用户自定义配置
    _init.prepareUserEnv(program.workspace);
    //读取运行时环境配置
    _init.prepareRuntimeEnv(program.enviroment || "production");
    _init.setRunType("precompile");
    let outdir = program.outdir || "prebuild";
    config_filed_constant_1.default.setBuildParams({ outdir: outdir });
    _init.addBuildIgnore(outdir);
    //检查启动参数是否合法
    if (!_init.checkStartArgs()) {
        process.exit(1);
    }
    ;
    _cli.checkLatestVersion();
    if (program.check) {
        //检查cli 版本
        // 检查插件版本
        if (!_utils.checkPluginVersion() || !_cli.checkVersion()) {
            process.exit(1);
        }
    }
}
exports.prepare = prepare;
/* istanbul ignore next  */
function commander(_commander) {
    _commander.command('precompile')
        .alias("prebuild")
        .description('启动预编译')
        .option('-w, --workspace <value>', '指定工作目录')
        .option('-o, --outdir', '预编译输出路径')
        .option('-e, --enviroment <value>', "运行时环境可选[develop, production，或其他] 默认production")
        .option('-l, --log <value>', 'log日志,( 0[defaul]: show all; 1: show error, fail; 2: show error, fail, warn)', (value) => { log_1.default.setLevel(value); })
        .allowUnknownOption()
        .action((program) => {
        prepare(program);
        _precompile.compile();
    });
}
exports.commander = commander;
