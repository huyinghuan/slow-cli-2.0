#!/usr/bin/env node
':'; //; exec node --harmony "$0" "$@";
"use strict";
const _commander = require('commander');
const start_1 = require('./start');
const init_1 = require('./init');
const check_1 = require('./check');
const _projectUtils = require('../lib/project');
const file_config_1 = require('../file-config');
//import * as colors from 'colors' 坑, 全应用引用， 其他module无须重复引用
require('colors');
/**
 * 全局变量，保存配置数据
 */
global.__CLI = {};
const versionDesc = _projectUtils.getCLIVersion();
start_1.default(_commander);
init_1.default(_commander);
check_1.default(_commander);
_commander.version(versionDesc).parse(process.argv);
console.log(`${file_config_1.default.infinity} version is ${versionDesc}`.green);
