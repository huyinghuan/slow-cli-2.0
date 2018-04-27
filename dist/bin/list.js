"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _init = require("../init");
const _project = require("../project");
const _cli = require("../cli");
const _plugin = require("../plugin/index");
const _ = require("lodash");
const config_filed_constant_1 = require("../config-filed-constant");
const padding_1 = require("../lib/padding");
const log_1 = require("../lib/log");
function execute(program) {
    //读取用户自定义配置
    _init.prepareUserEnv(program.workspace);
    //检查cli 版本
    _cli.checkVersion();
    //没有指定，安装所有
    let pluginConfig = config_filed_constant_1.default.getPluginConfig();
    let pluginNameArr = [];
    let versionDependencies = _.extend({}, _project.getProjectPackageJSONField('devDependencies'), _project.getProjectPackageJSONField('dependencies'));
    log_1.default.info(`[ ] Type ${padding_1.default("Name", 20)} ${padding_1.default("Dependency", 12)} Installed`.green);
    log_1.default.info(`---------------------------------------------------`.green);
    Object.keys(pluginConfig).forEach((key) => {
        if (pluginConfig[key] == false) {
            log_1.default.info(`插件 ${padding_1.default(key, 20)} 已被禁用`.red);
            return;
        }
        if (_.isPlainObject(pluginConfig[key]) && pluginConfig[key].__source) {
            log_1.default.info(`插件 ${padding_1.default(key, 20)} 处于开发中模式`.yellow);
            return;
        }
        let version = versionDependencies[_plugin.getFullPluginName(key, false)];
        let hadInstalledVersion = _plugin.getInstalledPluginVersion(_plugin.getFullPluginName(key, false));
        let pluginType = "插件";
        if (key.indexOf("srp-") == -1) {
            pluginType = "组件";
        }
        if (version == hadInstalledVersion) {
            log_1.default.info(`[✔] ${pluginType} ${padding_1.default(key, 20)} ${padding_1.default(version, 12)}`.green);
        }
        else {
            log_1.default.info(`[x] ${pluginType} ${padding_1.default(key, 20)} ${padding_1.default(version, 12)} ${hadInstalledVersion}`.red);
        }
    });
}
exports.execute = execute;
/* istanbul ignore next  */
function commander(_commander) {
    _commander.command('list')
        .description('检查版本信息和插件信息')
        .option('-w, --workspace <value>', '指定工作目录')
        .action(execute);
}
exports.commander = commander;
