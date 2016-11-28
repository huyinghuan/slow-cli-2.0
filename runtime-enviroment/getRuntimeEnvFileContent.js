"use strict";
const _init = require('../init/index');
const _fs = require('fs-extra');
const _path = require('path');
const config_filed_constant_1 = require('../config-filed-constant');
/**
 *  throw Error
 */
function default_1(filename) {
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
        throw new Error("文件未找到");
    }
    return _fs.readFileSync(filename, "utf8");
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
