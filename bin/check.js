"use strict";
const _init = require('../init');
const _projectUtils = require('../lib/project');
function default_1(_commander) {
    _commander.command('check')
        .description('检查版本信息和插件信息')
        .action((program) => {
        //读取用户自定义配置
        _init.prepareUserEnv();
        //检查cli 版本
        _projectUtils.checkCLIVersion();
        // 检查插件版本
        _projectUtils.checkPluginVersion();
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
