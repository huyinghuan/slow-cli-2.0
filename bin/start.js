"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _init = require("../init/index");
const _project = require("../project");
const _utils = require("../plugin/index");
const app_1 = require("../app");
const extraParamsParse_1 = require("./extraParamsParse");
const log_1 = require("../lib/log");
const config_filed_constant_1 = require("../config-filed-constant");
const checkLatestCLIVersion_1 = require("../lib/checkLatestCLIVersion");
const reportLog_1 = require("../lib/reportLog");
function getHttpServer(program) {
    //读取用户自定义配置
    _init.prepareUserEnv(program.workspace, program.noConfig);
    //读取运行时环境配置
    _init.prepareRuntimeEnv(program.enviroment);
    //运行时参数记录
    let userInputArgs = {};
    if (program.port) {
        userInputArgs.port = program.port;
    }
    //设置用户自定义启动参数
    config_filed_constant_1.default.setGlobal(userInputArgs);
    if (program.additional) {
        config_filed_constant_1.default.setGlobal(program.additional);
    }
    //检查启动参数是否合法
    if (!_init.checkStartArgs()) {
        process.exit(1);
    }
    ;
    checkLatestCLIVersion_1.default();
    reportLog_1.default();
    if (program.check) {
        //检查cli 版本
        // 检查插件版本
        if (!_utils.checkPluginVersion() || !_project.checkCLIVersion()) {
            process.exit(1);
        }
    }
    //启动http服务
    return app_1.default();
}
exports.getHttpServer = getHttpServer;
/* istanbul ignore next  */
function commander(_commander) {
    _commander.command('start')
        .description('启动http服务')
        .option('-w, --workspace <value>', '指定工作目录')
        .option('-p, --port <n>', '指定运行端口')
        .option('-c, --check', '检测运行版本，和插件版本')
        .option('-e, --enviroment <value>', "运行时环境可选[develop, production，或其他] 默认develop")
        .option('-l, --log <value>', 'log日志,( 0[defaul]: show all; 1: show error, fail; 2: show error, fail, warn)', (value) => { log_1.default.setLevel(value); })
        .option('-n, --noConfig', "无配置文件运行")
        .option('-A, --additional <items>', '额外的参数，格式 -A A=1[,B=xxx]', extraParamsParse_1.default)
        .allowUnknownOption()
        .action((program) => {
        let server = getHttpServer(program);
        let port = program.port || config_filed_constant_1.default.getGlobal('port');
        server.listen(port);
        console.log(`silky run on http://localhost:${port}`.green);
    });
}
exports.commander = commander;
