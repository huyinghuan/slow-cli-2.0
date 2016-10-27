#!/usr/bin/env node
':'; //; exec node --harmony "$0" "$@";
"use strict";
const _commander = require('commander');
const _init = require('../lib/init');
const app_1 = require('../lib/app');
/**
 * 全局变量，保存配置数据
 */
global.__CLI = {};
const versionDesc = require('../package').version;
_commander.command('start')
    .description('启动http服务')
    .option('-p, --port <n>', '指定运行端口')
    .action((program) => {
    //读取用户自定义配置
    _init.prepareUserEnv();
    //加载插件
    _init.loadPlugins((error) => {
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
_commander.version(versionDesc).parse(process.argv);
