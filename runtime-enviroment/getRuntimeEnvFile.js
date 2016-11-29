"use strict";
const _init = require('../init/index');
const _fs = require('fs-extra');
const _path = require('path');
const config_filed_constant_1 = require('../config-filed-constant');
/**
 * desc:
 *   搜索顺序  指定的运行环境【默认:develop】 -->  通用目录搜索 -->  .silky根目录
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
    let filepath = "";
    //存在运行环境下的文件返回运行环境下的文件内容
    if (_fs.existsSync(_path.join(env.enviromentDir, filename))) {
        filepath = _path.join(env.enviromentDir, filename);
    }
    else if (_fs.existsSync(_path.join(config_filed_constant_1.default.normalEnviromentDir, filename))) {
        //如果不存在 读取 通用环境目录下的内容
        filepath = _path.join(config_filed_constant_1.default.normalEnviromentDir, filename);
    }
    else if (_fs.existsSync(_path.join(config_filed_constant_1.default.environmentRootDir, filename))) {
        filepath = _path.join(config_filed_constant_1.default.environmentRootDir, filename);
    }
    if (filepath == "") {
        throw new Error(`${filename} 文件未找到`);
    }
    if (asString) {
        return _fs.readFileSync(filepath, "utf8");
    }
    return require(filepath);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
