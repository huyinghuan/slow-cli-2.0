"use strict";
const _init = require("../init");
const _project = require("../project");
const _plugin = require("../plugin/index");
const _ = require("lodash");
const preparePrerequisiteDir_1 = require("../init/preparePrerequisiteDir");
function execute(program) {
    //读取用户自定义配置
    _init.prepareUserEnv(program.workspace);
    //检查cli 版本
    _project.checkCLIVersion();
    // 检查插件版本
    let pluginVersionList = _plugin.checkPluginVersion(true);
    if (program.fix) {
        console.log('更新配置文件...');
        // TODO
        let defaultConfig = _init.generatorDefaultConfig();
        let packageJSON = _project.getProjectPackageJSON();
        _.extend(defaultConfig, packageJSON);
        _project.writeProjectPackageJSON(defaultConfig);
        preparePrerequisiteDir_1.default();
        console.log('更新配置文件完成...');
        console.log('开始安装插件...');
        _plugin.install(pluginVersionList, program.registry, (error) => {
            if (error) {
                console.log(error);
                console.log("安装失败");
            }
            else {
                console.log('安装成功'.green);
            }
        });
    }
}
exports.execute = execute;
/* istanbul ignore next  */
function commander(_commander) {
    _commander.command('check')
        .description('检查版本信息和插件信息')
        .option('-w, --workspace <value>', '指定工作目录')
        .option('-f, --fix', '修复相关配置文件')
        .option('-r, --registry <value>', "指定插件的仓库地址")
        .action(execute);
}
exports.commander = commander;
