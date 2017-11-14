"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("../lib/log");
const _plugin = require("../plugin/index");
const _ = require("lodash");
const _project = require("../project");
const _init = require("../init/index");
const config_filed_constant_1 = require("../config-filed-constant");
const padding_1 = require("../lib/padding");
const _child = require("child_process");
function execute(plugins, program, finish) {
    //读取用户自定义配置
    _init.prepareUserEnv(program.workspace);
    let packageJSON = _project.getProjectPackageJSON();
    let saveAsProduct = program.save;
    if (plugins.length) {
        //写入到package.json
        _plugin.install(plugins, program.registry, saveAsProduct, (error, installSuccessPlugnList) => {
            let pluginConfig = {};
            installSuccessPlugnList.forEach((pluginName) => {
                pluginName = _plugin.getFullPluginName(pluginName, false);
                pluginConfig[pluginName] = _plugin.getPluginConfig(pluginName);
            });
            _plugin.writePluginConfigToConfigFile(pluginConfig);
            finish(error);
        });
        return;
    }
    //没有指定，安装所有
    let pluginConfig = config_filed_constant_1.default.getPluginConfig();
    let pluginNameArr = [];
    let versionDependencies = _.extend({}, _project.getProjectPackageJSONField('devDependencies'), _project.getProjectPackageJSONField('dependencies'));
    Object.keys(pluginConfig).forEach((key) => {
        if (pluginConfig[key] == false) {
            log_1.default.info(`插件 ${padding_1.default(key, 20)} 已被禁用， 跳过安装`.red);
            return;
        }
        if (_.isPlainObject(pluginConfig[key]) && pluginConfig[key].__source) {
            log_1.default.info(`插件 ${padding_1.default(key, 20)} 处于开发中模式， 跳过安装`.yellow);
            return;
        }
        let version = versionDependencies[_plugin.getFullPluginName(key, false)];
        let hadInstalledVersion = _plugin.getInstalledPluginVersion(_plugin.getFullPluginName(key, false));
        let pluginType = "插件";
        if (key.indexOf("sp-") == -1) {
            pluginType = "组件";
        }
        if (version == hadInstalledVersion && !program.force && !program.newest) {
            return console.log(`${pluginType} ${padding_1.default(key, 20)} 版本 ${version} [✔]`.green);
        }
        if (program.newest) {
            version = "latest";
        }
        //获取依赖的版本,如果有依赖版本则安装依赖版本
        if (versionDependencies[_plugin.getFullPluginName(key, false)]) {
            key = `${key}@${version}`;
        }
        pluginNameArr.push(key);
    });
    if (pluginNameArr.length == 0) {
        return console.log('所有依赖已全部安装。');
    }
    _plugin.install(pluginNameArr, program.registry, saveAsProduct, finish);
}
exports.execute = execute;
/* istanbul ignore next  */
function commander(_commander) {
    _commander.command('install [plugins...]')
        .description('安装插件')
        .option('-w, --workspace <value>', '指定工作目录')
        .option('-n, --newest', "更新插件到最新版本")
        .option('-l, --log <value>', 'log日志,( 0[defaul]: show all; 1: show error, fail; 2: show error, fail, warn)', (value) => { log_1.default.setLevel(value); })
        .option('-f, --force', '强制重新安装')
        .option('-r, --registry <value>', "指定插件的仓库地址")
        .option('-s, --save', '以产品模式安装插件，用于开发js css lib 库')
        .action((plugins, program) => {
        //检查npm版本，低于5.0爆错 //
        let npmVersion = String(_child.execSync("npm --version")).replace(/\s/g, "");
        if (parseInt(npmVersion) < 5) {
            console.error(`当前npm版本是:${npmVersion}, 请使用 'npm install -g npm@latest' 升级npm到 5.x版本`);
            process.exit(1);
        }
        execute(plugins, program, (error) => {
            if (error) {
                log_1.default.error(error);
            }
            else {
                log_1.default.success("安装插件完成！".green);
            }
        });
    });
    _commander.command('uninstall [plugins...]')
        .alias("remove")
        .action((plugins, program) => {
        plugins.forEach((pluginName) => {
            _plugin.removePluginConfig(pluginName);
        });
    });
}
exports.commander = commander;
