"use strict";
const _init = require('../init');
const _projectUtils = require('../lib/project');
const _plugin = require('../plugin/index');
const _ = require('lodash');
const preparePrerequisiteDir_1 = require('../init/preparePrerequisiteDir');
function default_1(_commander) {
    _commander.command('check')
        .description('检查版本信息和插件信息')
        .option('-f, --fix', '修复相关配置文件')
        .action((program) => {
        //读取用户自定义配置
        _init.prepareUserEnv();
        //检查cli 版本
        _projectUtils.checkCLIVersion();
        // 检查插件版本
        let isMatchPluginVersion = _plugin.checkPluginVersion();
        if (program.fix) {
            console.log('更新配置文件...');
            // TODO
            let defaultConfig = _init.generatorDefaultConfig();
            let packageJSON = _init.getProjectPackageJSON();
            _.extend(defaultConfig, packageJSON);
            _init.writeProjectPackageJSON(defaultConfig);
            preparePrerequisiteDir_1.default();
            console.log('更新配置文件完成...');
        }
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
