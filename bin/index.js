#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _commander = require("commander");
const _start = require("./start");
const _init = require("./init");
const _check = require("./check");
const _build = require("./build");
const _install = require("./install");
const _info = require("./info");
const _config = require("./config");
const _project = require("../project");
const _dev = require("./dev");
const _list = require("./list");
const config_filed_constant_1 = require("../config-filed-constant");
const _preview = require("./preview");
//import * as colors from 'colors' 坑, 全应用引用， 其他module无须重复引用
require('colors');
/**
 * 全局变量，保存配置数据
 */
const versionDesc = _project.getCLIVersion();
console.log(`${config_filed_constant_1.default.get().infinity} version is ${versionDesc}`.green);
_start.commander(_commander);
_init.commander(_commander);
_check.commander(_commander);
_build.commander(_commander);
_install.commander(_commander);
_info.commander(_commander);
_config.commander(_commander);
_dev.commander(_commander);
_list.commander(_commander);
_preview.commander(_commander);
_commander.version(versionDesc).parse(process.argv);
