"use strict";
const _init = require('../init/index');
const _fs = require('fs-extra');
const _path = require('path');
const _ = require('lodash');
const config_filed_constant_1 = require('../config-filed-constant');
/**
 * desc:
 *   搜索顺序  指定的运行环境【默认:develop】 -->  通用目录搜索
 *
 * params:
 *    filename, 文件名称
 *    asString 作为string返回
 *
 * return:
 *    string or jsonObject
 *
 * throw Error
 */
function default_1(filename, asString) {
    if (!filename) {
        throw new Error(`获取文件名undefined`);
    }
    let env = _init.getEnviroment();
    let envFilepath = "";
    let normalFilePath = "";
    if (_fs.existsSync(_path.join(env.enviromentDir, filename))) {
        envFilepath = _path.join(env.enviromentDir, filename);
    }
    if (_fs.existsSync(_path.join(config_filed_constant_1.default.normalEnviromentDir, filename))) {
        //如果不存在 读取 通用环境目录下的内容
        normalFilePath = _path.join(config_filed_constant_1.default.normalEnviromentDir, filename);
    }
    if (envFilepath == "" && normalFilePath == "") {
        throw new Error(`${filename} 文件未找到`);
    }
    //作为文件内容读取顺序
    if (asString) {
        //存在运行环境下的文件返回运行环境下的文件内容
        //如果不存在运行环境下的文件 读取通用环境目录下的内容
        let filePath = !!envFilepath ? envFilepath : normalFilePath;
        return _fs.readFileSync(filePath, "utf8");
    }
    let normalBase = {};
    let envBase = {};
    //作为数据读取顺序
    if (!!normalFilePath) {
        normalBase = require(normalFilePath);
    }
    if (!!envFilepath) {
        envBase = require(envFilepath);
    }
    return _.extend(normalBase, envBase);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
