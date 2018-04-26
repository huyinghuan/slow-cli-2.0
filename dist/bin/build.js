"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _init = require("../init/index");
const _build = require("../build/index");
const _project = require("../project");
const _cli = require("../cli");
const _plugin = require("../plugin/index");
const extraParamsParse_1 = require("./extraParamsParse");
const log_1 = require("../lib/log");
const config_filed_constant_1 = require("../config-filed-constant");
const reportLog_1 = require("../lib/reportLog");
/**环境变量初始化 ,是否存在错误，true 存在，false不存在*/
function prepare(program) {
    //读取用户自定义配置
    _init.prepareUserEnv(program.workspace);
    _init.prepareRuntimeEnv(program.enviroment || "production");
    //build 强制进行版本检查
    let checkCLIResult = _cli.checkVersion();
    let checPluginResult = _plugin.checkPluginVersion();
    _init.setRunType("build");
    //如没有强制build项目，那么如果cli版本检查没通过则结束build
    if (!program.force && !checkCLIResult) {
        return true;
    }
    //强制build对plugin无效
    if (!checPluginResult) {
        return true;
    }
    //运行时参数记录
    let userInputArgs = {};
    //制定编译输出目录
    if (program.outdir) {
        userInputArgs.outdir = program.outdir;
    }
    //更新全局变量下的编译参数。
    config_filed_constant_1.default.setBuildParams(userInputArgs);
    if (program.additional) {
        config_filed_constant_1.default.setBuildParams(program.additional);
    }
    //检查编译参数
    if (!_init.checkBuildArgs()) {
        return true;
    }
    return false;
}
exports.prepare = prepare;
function execute(program) {
    return __awaiter(this, void 0, void 0, function* () {
        /* istanbul ignore if  */
        reportLog_1.default("build", "process");
        if (program.update) {
            _project.updateProjectCLIVersion();
        }
        if (prepare(program)) {
            throw new Error("初始化配置失败");
        }
        return _build.buildProcess();
        // if(program.httpServer){
        //   let app = getBuildServer(program)
        //   let port = program.port || 14423
        //   app.listen(port);
        //   _reportLog("build", "server")
        //   console.log(`Build Server listen at port ${port}`.green)
        // }else if(program.singleFile){
        //   _reportLog("build", "single")
        //   _build.buildSingleFile(function(){
        //     if(prepare(program)){
        //       finish("初始化配置失败")
        //     }
        //   }, program.singleFile, finish)
        // }else{
        //   _reportLog("build", "process")
        //   if(program.update){
        //     _project.updateProjectCLIVersion()
        //   }
        //   _build.buildProcess(function(){
        //     if(prepare(program)){
        //       finish("初始化配置失败")
        //     }
        //   }, finish)
        // }
    });
}
exports.execute = execute;
/* istanbul ignore next  */
function commander(_commander) {
    _commander.command('build')
        .description('编译')
        .option('-w, --workspace <value>', '指定工作目录')
        .option('-o, --outdir <value>', '指定build文件夹')
        .option('-i, --singleFile <value>', "编译指定文件")
        .option('-f, --force', '强制进行build，哪怕版本检查没通过')
        .option('-u, --update', '更新package.json版本到当前sr版本')
        .option('-e, --enviroment <value>', "运行时环境可选[develop, production，或其他] 默认production")
        .option('-l, --log <value>', 'log日志,( 0[defaul]: show all; 1: show error, fail; 2: show error, fail, warn)', (value) => { log_1.default.setLevel(value); })
        .option('-A, --additional <items>', '额外的参数，格式 -A A=1[,B=xxx] 或者指定唯一值  -A value', extraParamsParse_1.default)
        .option('-s, --httpServer', '作为http server启动')
        .option('-p, --port <value>', '仅当存在-s选项时，该配置起作用，用来指定http server端口，默认为 14423')
        .allowUnknownOption()
        .action((program) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield execute(program);
        }
        catch (error) {
            if (error) {
                log_1.default.error(error);
                process.exit(1);
            }
            else {
                process.exit(0);
            }
        }
    }));
}
exports.commander = commander;
