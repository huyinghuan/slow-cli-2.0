"use strict";
const _ = require("lodash");
const _fs = require("fs-extra");
const _async = require("async");
const _initUtils = require("../init/index");
const config_filed_constant_1 = require("../config-filed-constant");
const _project = require("../project");
const _plugin = require("../plugin/index");
const _init = require("../init/index");
function execute(program, finish) {
    //读取用户自定义配置
    _init.prepareUserEnv(program.workspace);
    let queue = [];
    //生成默认配置文件
    queue.push((cb) => {
        cb(null, _initUtils.generatorDefaultConfig());
    });
    let configFiledConstant = config_filed_constant_1.default.get();
    //从服务器拉去配置指定插件配置文件
    if (program.pluginListName) {
        queue.push((defaultConfig, cb) => {
            _initUtils.getRemoteServerProjectPluginConfig(program.pluginListName, (error, pluginConfig) => {
                cb(error, _plugin.setPluginConfig(defaultConfig, pluginConfig));
            });
        });
    }
    //如果已经存在package.json文件，那么读取内容，覆盖配置
    queue.push((defaultConfig, cb) => {
        let packageJSON = _project.getProjectPackageJSON();
        // (default-config.plugin-config) [extend] (remote project plugin config)
        // (default-config) [extend] (package json)
        if (program.pluginListName) {
            delete packageJSON[configFiledConstant.pluginConfigField];
        }
        Object.keys(packageJSON).forEach((key) => {
            if (defaultConfig[key]) {
                defaultConfig[key] = _.extend(defaultConfig[key], packageJSON[key]);
            }
            else {
                defaultConfig[key] = packageJSON[key];
            }
        });
        cb(null, defaultConfig);
    });
    //生产配置文件
    _async.waterfall(queue, (error, config) => {
        if (!error) {
            _fs.writeJSONSync(configFiledConstant.CLIConfigFile, config);
        }
        finish(error);
    });
}
exports.execute = execute;
/* istanbul ignore next  */
function commander(_commander) {
    _commander.command('init')
        .description('初始化')
        .option('-p, --pluginListName <value>', '根据插件列表名称获取插件列表')
        .option('-n, --newPlugin <value>', '新建一个插件脚手架， 自定插件名称')
        .option('-w, --workspace <value>', '指定工作目录')
        .action((program) => {
        execute(program, (error) => {
            if (error) {
                console.log('初始化失败。。。'.red);
                console.log(error);
                process.exit(1);
            }
            console.log('初始化成功！ 安装插件请运行命令 silky install'.green);
            process.exit(0);
        });
    });
}
exports.commander = commander;
