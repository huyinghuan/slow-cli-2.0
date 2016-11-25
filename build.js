"use strict";
const _async = require('async');
const _fs = require('fs-extra');
const _path = require('path');
const _init = require('./init/index');
const _hook = require('./hooks/index');
const _plugin = require('./plugin/index');
const log_1 = require('./lib/log');
const getAllFileInProject_1 = require('./lib/getAllFileInProject');
const _workspace = process.cwd();
/**
 * 编译单个文件
 * 触发发各类hook，doCompile, didCompile*/
function compileFile(buildConfig, data, next) {
    let queue = [];
    //编译工具编译
    queue.push((cb) => {
        _hook.triggerBuildDoCompileHook(data, cb);
    });
    //内容加工
    queue.push((data, content, cb) => {
        _hook.triggerBuildDidCompileHook(data, content, cb);
    });
    /**
     * 已经编译完成，写入文件。
     * 如果没有任何内容，则跳过, 如果ignore为true也跳过
    */
    queue.push((data, content, cb) => {
        if (!content || data.ignore) {
            return cb(null, false, data);
        }
        let outputFilePathArr = [].concat(data.outputFilePath);
        let appendFile = data.appendFile;
        try {
            //如果一个内容要输出到多个文件
            outputFilePathArr.forEach((outputFilePath) => {
                if (!appendFile || !_fs.existsSync(outputFilePath)) {
                    _fs.outputFileSync(outputFilePath, content);
                }
                else {
                    _fs.appendFileSync(outputFilePath, content, { encoding: 'utf8' });
                }
            });
        }
        catch (e) {
            return cb(e);
        }
        cb(null, true, data);
    });
    /* 未完成编译， 触发hook， hook如果已经写入文件，那么不做任何事情， 如果ignore为true也不做任何事情
     如果没有写入文件， 那么默认copy[调用默认hook(plugin/default-plugin/build/*)]文件。*/
    queue.push((didWrite, data, cb) => {
        if (didWrite || data.ignore) {
            return cb(null);
        }
        _hook.triggerBuildDoNothingHook(data, (error, processResult) => {
            if (error) {
                return cb(error);
            }
            if (processResult.hasProcess) {
                return cb(null);
            }
            log_1.default.info(`忽略文件: ${processResult.inputFilePath}`);
            cb(null);
        });
    });
    _async.waterfall(queue, (error) => next(error));
}
/**
 * 编译文件队列 */
function compilerFileQueue(buildConfig, fileQueue, next) {
    //确保编译目录存在
    _fs.ensureDirSync(buildConfig.outdir);
    //清空编译目录
    _fs.emptyDirSync(buildConfig.outdir);
    //异步编译
    _async.map(fileQueue, (fileItem, cb) => {
        let data = {
            inputFilePath: fileItem.filePath,
            outputFilePath: _path.join(buildConfig.outdir, fileItem.relativeDir, fileItem.fileName),
            outdir: buildConfig.outdir,
            inputFileRelativePath: _path.join(fileItem.relativeDir, fileItem.fileName),
            outputFileRelativePath: _path.join(buildConfig.outRelativeDir, fileItem.relativeDir, fileItem.fileName),
            fileName: fileItem.fileName,
            appendFile: false,
            ignore: false
        };
        compileFile(buildConfig, data, cb);
    }, (error, result) => {
        next(error, buildConfig);
    });
}
function normalExecute() {
    let queue = [];
    //获取所有待编译文件
    let fileQueue = getAllFileInProject_1.default(false);
    //获取编译参数
    let buildConfig = _init.getBuildConfig();
    //将要编译了
    queue.push((next) => {
        _hook.triggerBuildWillDoHook(buildConfig, next);
    });
    //处理文件队列 （doCompile，didCompile，doNothing) in there
    queue.push((buildConfig, next) => {
        //编译文件
        compilerFileQueue(buildConfig, fileQueue, next);
    });
    //endBuild gzip 发送
    queue.push((buildConfig, next) => {
        _hook.triggerBuildEndHook(buildConfig, next);
    });
    _async.waterfall(queue, (error) => {
        if (error) {
            log_1.default.error(error);
            log_1.default.error("build fail".red);
            _hook.triggerBuildErrorHook(error);
            return process.exit(1);
        }
        console.log("build success".green);
    });
}
function default_1() {
    //加载插件
    _plugin.scanPlugins('build');
    let queue = [];
    //build初始化HOOK
    queue.push((cb) => { _hook.triggerBuildInitHook(cb); });
    _async.waterfall(queue, (error, stop) => {
        if (error) {
            log_1.default.error(error);
            log_1.default.fail('build 初始化失败'.red);
            _hook.triggerBuildErrorHook(error);
            return;
        }
        if (stop) {
            return;
        }
        normalExecute();
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
