"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _fs = require("fs");
const _path = require("path");
const _init = require("../init/index");
const _project = require("../project");
const _utils = require("../plugin/index");
const _http = require("http");
const _https = require("https");
const app_1 = require("../app");
const extraParamsParse_1 = require("./extraParamsParse");
const log_1 = require("../lib/log");
const config_filed_constant_1 = require("../config-filed-constant");
const checkLatestCLIVersion_1 = require("../lib/checkLatestCLIVersion");
const reportLog_1 = require("../lib/reportLog");
const _plugin = require("../plugin/index");
const unregisterHooks_1 = require("../hooks/unregisterHooks");
function watchConfig(program) {
    let workspace = config_filed_constant_1.default.getWorkspace();
    let packageJsonFilePath = _path.join(workspace, "package.json");
    _fs.watch(packageJsonFilePath, function (eventType, filename) {
        if (eventType == "rename" && filename != "package.json") {
            log_1.default.error("package.json be delete！ can not reload config".red);
            return;
        }
        //Reload config
        prepare(program);
        unregisterHooks_1.default();
        _plugin.scanPlugins('route');
    });
    let configDir = _path.join(workspace, ".silky");
    if (!_fs.existsSync(configDir)) {
        return;
    }
    _fs.watch(configDir, { recursive: true }, function () {
        //ReloadConfig
        prepare(program);
        unregisterHooks_1.default();
        _plugin.scanPlugins('route');
    });
}
function prepare(program) {
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
    _init.setRunType("dev");
    //检查启动参数是否合法
    if (!_init.checkStartArgs()) {
        process.exit(1);
    }
    ;
    checkLatestCLIVersion_1.default();
    if (program.check) {
        //检查cli 版本
        // 检查插件版本
        if (!_utils.checkPluginVersion() || !_project.checkCLIVersion()) {
            process.exit(1);
        }
    }
}
exports.prepare = prepare;
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
        prepare(program);
        let app = app_1.default();
        let port = program.port || config_filed_constant_1.default.getGlobal('port');
        reportLog_1.default("start", "success");
        let server = _http.createServer(app);
        server.on('error', (error) => {
            if (error.code == 'EADDRINUSE') {
                console.log("端口冲突，请使用其它端口".red);
                return process.exit(1);
            }
            console.log(error);
            return process.exit(1);
        });
        if (!program.noConfig) {
            watchConfig(program);
        }
        console.log(`silky run on http://localhost:${port}`.green);
        server.listen(port);
    });
    _commander.command('https')
        .description('启动https服务')
        .option('-w, --workspace <value>', '指定工作目录')
        .option('-p, --port <n>', '指定运行端口')
        .option('-c, --check', '检测运行版本，和插件版本')
        .option('-e, --enviroment <value>', "运行时环境可选[develop, production，或其他] 默认develop")
        .option('-l, --log <value>', 'log日志,( 0[defaul]: show all; 1: show error, fail; 2: show error, fail, warn)', (value) => { log_1.default.setLevel(value); })
        .option('-n, --noConfig', "无配置文件运行")
        .option('-A, --additional <items>', '额外的参数，格式 -A A=1[,B=xxx]', extraParamsParse_1.default)
        .allowUnknownOption()
        .action((program) => {
        prepare(program);
        let app = app_1.default();
        let port = program.port || config_filed_constant_1.default.getGlobal('port');
        reportLog_1.default("start", "success");
        let httpsServer = _https.createServer({
            key: _fs.readFileSync(_path.join(__dirname, '..', 'ssl', 'client-key.pem')),
            cert: _fs.readFileSync(_path.join(__dirname, '..', 'ssl', 'client-cert.pem'))
        }, app);
        httpsServer.on('error', (error) => {
            if (error.code == 'EADDRINUSE') {
                console.log("端口冲突，请使用其它端口".red);
                return process.exit(1);
            }
            console.log(error);
            return process.exit(1);
        });
        if (!program.noConfig) {
            watchConfig(program);
        }
        httpsServer.listen(port);
        console.log(`silky run on https://localhost:${port}`.green);
    });
}
exports.commander = commander;
