#!/usr/bin/env node
':' //; exec node --harmony "$0" "$@";
import * as _commander from 'commander';
import _start from './start';
//import * as colors from 'colors' 坑, 全应用引用， 其他module无须重复引用
require('colors');
/**
 * 全局变量，保存配置数据
 */
(global as any).__CLI = {};

const versionDesc = require('../package').version;

_start(_commander);

_commander.version(versionDesc).parse(process.argv)