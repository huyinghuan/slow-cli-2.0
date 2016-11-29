#! /usr/bin/env node --harmony
"use strict";
const _commander = require('commander');
const start_1 = require('./start');
const init_1 = require('./init');
const check_1 = require('./check');
const build_1 = require('./build');
const install_1 = require('./install');
const info_1 = require('./info');
const _project = require('../project');
const config_filed_constant_1 = require('../config-filed-constant');
//import * as colors from 'colors' 坑, 全应用引用， 其他module无须重复引用
require('colors');
/**
 * 全局变量，保存配置数据
 */
global.__CLI = {};
const versionDesc = _project.getCLIVersion();
console.log(`${config_filed_constant_1.default.infinity} version is ${versionDesc}`.green);
start_1.default(_commander);
init_1.default(_commander);
check_1.default(_commander);
build_1.default(_commander);
install_1.default(_commander);
info_1.default(_commander);
_commander.version(versionDesc).parse(process.argv);
