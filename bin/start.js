"use strict";
const _init = require('../init');
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
            //静态域名接口
            if (program.port) {
                global.__CLI.port = program.port;
            }
            app_1.default();
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
