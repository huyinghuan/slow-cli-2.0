"use strict";
const _init = require('../init/index');
const _hook = require('../hooks/index');
function default_1(_commander) {
    _commander.command('build')
        .description('编译')
        .option('-o, --outdir <value>', '指定build文件夹')
        .action((program) => {
        //读取用户自定义配置
        _init.prepareUserEnv();
        //加载插件
        _hook.scanPlugins((error) => {
            if (error) {
                return;
            }
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
