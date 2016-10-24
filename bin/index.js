#!/bin/sh
':'; //; exec node --harmony "$0" "$@";
"use strict";
const _commander = require('commander');
const _init = require('../lib/init');
const app_1 = require('../lib/app');
var __CLI = global.__CLI = {};
const init = function () {
};
_commander.command('start')
    .description('启动http服务')
    .option('-p, --port <n>', '指定运行端口')
    .action((program) => {
    //读取用户自定义配置
    _init.prepareUserEnv();
    //静态域名接口
    if (program.port) {
        __CLI.port = program.port;
    }
    app_1.default();
});
