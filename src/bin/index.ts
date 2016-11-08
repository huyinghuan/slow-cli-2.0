#!/usr/bin/env node
':' //; exec node --harmony "$0" "$@";
import * as _commander from 'commander';
import _start from './start';
import _init from './init'
import _check from './check';
import * as _projectUtils from '../lib/project';
import _fileConfig from '../file-config';
//import * as colors from 'colors' 坑, 全应用引用， 其他module无须重复引用
require('colors');
/**
 * 全局变量，保存配置数据
 */
(global as any).__CLI = {};

const versionDesc = _projectUtils.getCLIVersion();

_start(_commander);
_init(_commander);
_check(_commander);
_commander.version(versionDesc).parse(process.argv);

console.log(`${_fileConfig.infinity} version is ${versionDesc}`.green)