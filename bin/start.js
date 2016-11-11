"use strict";
const _init = require('../init/index');
const _projectUtils = require('../lib/project');
const app_1 = require('../app');
const _hook = require('../hooks/index');
function default_1(_commander) {
    _commander.command('start')
        .description('启动http服务')
        .option('-p, --port <n>', '指定运行端口')
        .option('-c, --check', '检测运行版本，和插件版本')
        .action((program) => {
        //读取用户自定义配置
        _init.prepareUserEnv();
        //运行时参数记录
        let userInputArgs = {};
        if (program.port) {
            userInputArgs.port = program.port;
        }
        //设置用户自定义启动参数
        _init.setStartParams(userInputArgs);
        //检查启动参数是否合法
        if (!_init.checkStartArgs()) {
            process.exit(1);
        }
        ;
        if (program.check) {
            //检查cli 版本
            _projectUtils.checkCLIVersion();
            // 检查插件版本
            _projectUtils.checkPluginVersion();
        }
        //加载插件
        _hook.scanPlugins('route', (error) => {
            if (error) {
                return;
            }
            app_1.default();
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
