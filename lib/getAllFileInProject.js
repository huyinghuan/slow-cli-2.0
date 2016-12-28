"use strict";
const getAllFileInDir_1 = require("./getAllFileInDir");
const _init = require("../init/index");
const config_filed_constant_1 = require("../config-filed-constant");
/**
 * 是否应该处理该文件。
 * filename: string, filepath
 * return boolean.
 * 如果忽略 返回false
 * 如果处理 返回true
 */
function shouldInclude(filename, filepath) {
    const _buildConfig = _init.getBuildConfig();
    //忽略build文件夹
    if (filepath.indexOf(_buildConfig.outdir) != -1) {
        return false;
    }
    //需要忽略掉文件
    const buildIgnore = _buildConfig.ignore;
    for (let i = 0, length = buildIgnore.length; i < length; i++) {
        if (new RegExp(buildIgnore[i]).test(filepath)) {
            return false;
        }
    }
    return true;
}
/* 获取项目目录下的所有文件，除编译目录外*/
const getAllFileInProject = (justFilePath) => {
    let arr = getAllFileInDir_1.default(config_filed_constant_1.default.getWorkspace(), [], '.', shouldInclude);
    if (!justFilePath) {
        return arr;
    }
    let queue = [];
    arr.forEach((item) => { queue.push(item.filePath); });
    return queue;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getAllFileInProject;
