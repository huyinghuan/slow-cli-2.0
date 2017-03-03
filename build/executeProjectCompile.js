"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _async = require("async");
const _fs = require("fs-extra");
const getAllFileInProject_1 = require("../lib/getAllFileInProject");
const _hook = require("../hooks/index");
const compileFileQueue_1 = require("./compileFileQueue");
const compileFile_1 = require("./compileFile");
const log_1 = require("../lib/log");
/**
 * @params: buildConfig <Object> 编译参数
 * @params: finish <Function> 回调函数， 接收一个参数
*/
function default_1(buildConfig, finish) {
    let queue = [];
    //获取所有待编译文件
    let fileQueue = getAllFileInProject_1.default(false);
    //额外需要编译的文件
    buildConfig.__extra = [];
    //编译完成后需要删除掉冗余文件
    buildConfig.__del = [];
    //将要编译了
    queue.push((next) => {
        _hook.triggerBuildWillDoHook(buildConfig, next);
    });
    //处理文件队列 （doCompile，didCompile，doNothing) in there
    queue.push((buildConfig, next) => {
        //编译文件
        compileFileQueue_1.default(buildConfig, fileQueue, next);
    });
    /**/
    //处理额外的文件， 比如html中提取出来的js src， css link等文件合并
    queue.push((buildConfig, next) => {
        _async.map(buildConfig.__extra, (fileData, cb) => {
            compileFile_1.default(buildConfig, fileData, cb);
        }, (error) => {
            next(error, buildConfig);
        });
    });
    //删除标记文件
    queue.push((buildConfig, next) => {
        buildConfig.__del.forEach((filepath) => {
            _fs.removeSync(filepath);
            log_1.default.info(`remove ${filepath}`);
        });
        next(null, buildConfig);
    });
    queue.push((buildConfig, next) => {
        _hook.triggerBuildEndHook(buildConfig, next);
    });
    _async.waterfall(queue, (error) => {
        finish(error);
    });
}
exports.default = default_1;
