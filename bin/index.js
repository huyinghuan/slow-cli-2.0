#!/usr/bin/env node
':'; //; exec node --harmony "$0" "$@";
"use strict";
const _commander = require('commander');
const start_1 = require('./start');
//import * as colors from 'colors' 坑, 全应用引用， 其他module无须重复引用
require('colors');
/**
 * 全局变量，保存配置数据
 */
global.__CLI = {};
const versionDesc = require('../package').version;
start_1.default(_commander);
_commander.version(versionDesc).parse(process.argv);
