#!/usr/bin/env node
':'; //; exec node --harmony "$0" "$@";
"use strict";
const _commander = require('commander');
const _init = require('../lib/init');
const app_1 = require('../lib/app');
/**
 * 全局变量，保存配置数据
 */
var __CLI = global.__CLI = {};
const versionDesc = require('../package').version;
_commander.command('start')
    .description('启动http服务')
    .option('-p, --port <n>', '指定运行端口')
    .action((program) => {
    //读取用户自定义配置
    _init.prepareUserEnv();
    //加载插件
    _init.loadPlugins();
    //静态域名接口
    if (program.port) {
        __CLI.port = program.port;
    }
    app_1.default(__CLI);
});
_commander.version(versionDesc).parse(process.argv);
