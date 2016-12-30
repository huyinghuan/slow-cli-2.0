#! /usr/bin/env node --harmony
import * as _commander from 'commander';
import * as _start from './start';
import * as _init from './init'
import * as _check from './check';
import * as _build from './build';
import * as _install from './install';
import * as _info from './info';
import * as _config from './config';
import * as _project from '../project';
import * as _dev from './dev';

import _configFiledConstant from '../config-filed-constant';
//import * as colors from 'colors' 坑, 全应用引用， 其他module无须重复引用
require('colors');
/**
 * 全局变量，保存配置数据
 */

const versionDesc = _project.getCLIVersion();

console.log(`${_configFiledConstant.get().infinity} version is ${versionDesc}`.green)

_start.commander(_commander);
_init.commander(_commander);
_check.commander(_commander);
_build.commander(_commander);
_install.commander(_commander);
_info.commander(_commander);
_config.commander(_commander);
_dev.commander(_commander);

_commander.version(versionDesc).parse(process.argv);
