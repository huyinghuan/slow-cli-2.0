"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _fs = require("fs-extra");
const _path = require("path");
const _ = require("lodash");
const log_1 = require("../lib/log");
const config_filed_constant_1 = require("../config-filed-constant");
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
    let configFiledConstant = config_filed_constant_1.default.get();
    if (!filename) {
        throw new Error(`环境文件定义名 undefined,请确保'function getRuntimeEnvFile()'传入正确的文件名`);
    }
    let env = config_filed_constant_1.default.getEnviroment();
    let envFilepath = "";
    let normalFilePath = "";
    if (_fs.existsSync(_path.join(env.enviromentDir, filename))) {
        envFilepath = _path.join(env.enviromentDir, filename);
    }
    //是否存在 通用环境目录下的内容
    if (_fs.existsSync(_path.join(configFiledConstant.normalEnviromentDir, filename))) {
        normalFilePath = _path.join(configFiledConstant.normalEnviromentDir, filename);
    }
    if (envFilepath == "" && normalFilePath == "") {
        //throw new Error(`${filename} 文件未找到`)
        log_1.default.warn(`提示:环境 ${env} 中不存在文件 ${filename}`);
        return asString ? "" : {};
    }
    //作为文件内容读取顺序
    if (asString) {
        //存在运行环境下的文件返回运行环境下的文件内容
        //如果不存在运行环境下的文件 读取通用环境目录下的内容
        let filePath = !!envFilepath ? envFilepath : normalFilePath;
        return _fs.readFileSync(filePath, "utf8");
    }
    let normalBase = null;
    let envBase = null;
    //作为module读取
    if (!!normalFilePath) {
        normalBase = require(normalFilePath);
    }
    if (!!envFilepath) {
        envBase = require(envFilepath);
    }
    //moudle 是否为函数 如果环境变量为函数，则不用继承直接返回
    if (_.isFunction(envBase)) {
        return envBase;
    }
    //如果环境变量不存在， 通用变量存在则直接扔通用变量
    if (!envBase && normalBase) {
        return normalBase;
    }
    if ((_.isPlainObject(envBase) && _.isFunction(normalBase)) || (_.isPlainObject(normalBase) && _.isFunction(envBase))) {
        throw new Error(`环境变量和通用变量类型不一致 ${filename}`);
    }
    envBase = envBase || {};
    normalBase = normalBase || {};
    Object.keys(envBase).forEach((key) => {
        //避免误解
        if (normalBase[key] === null || normalBase[key] === undefined) {
            return normalBase[key] = envBase[key];
        }
        if (!_.isPlainObject(envBase[key])) {
            return normalBase[key] = envBase[key];
        }
        normalBase[key] = _.extend(normalBase[key], envBase[key]);
    });
    return normalBase;
}
exports.default = default_1;
