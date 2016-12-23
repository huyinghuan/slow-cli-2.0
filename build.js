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
        _hook.triggerBuildDoCompileHook(buildConfig, data, cb);
    });
    //内容加工
    queue.push((content, cb) => {
        _hook.triggerBuildDidCompileHook(buildConfig, data, content, cb);
    });
    /**
     * 已经编译完成，写入文件。
     * 如果没有任何内容，则跳过, 如果ignore为true也跳过
    */
    queue.push((content, cb) => {
        if (!content || data.ignore) {
            return cb(null, false);
        }
        let outputFilePathArr = [].concat(data.outputFilePath);
        let appendFile = data.appendFile;
        try {
            //如果一个内容要输出到多个文件
            outputFilePathArr.forEach((outputFilePath) => {
                if (!appendFile) {
                    _fs.outputFileSync(outputFilePath, content);
                }
                else {
                    log_1.default.info(`append ${data.inputFileRelativePath} to ${outputFilePath.replace(data.outdir, "")}`);
                    if (!_fs.existsSync(outputFilePath)) {
                        _fs.outputFileSync(outputFilePath, content);
                    }
                    else {
                        if (data.appendFilePrefix) {
                            content = data.appendFilePrefix + content;
                        }
                        _fs.appendFileSync(outputFilePath, content, { encoding: 'utf8' });
                    }
                }
            });
        }
        catch (e) {
            return cb(e);
        }
        cb(null, true);
    });
    /* 未完成编译， 触发hook， hook如果已经写入文件，那么不做任何事情， 如果ignore为true也不做任何事情
     如果没有写入文件， 那么默认copy[调用默认hook(plugin/default-plugin/build/*)]文件。*/
    queue.push((didWrite, cb) => {
        if (didWrite || data.ignore) {
            return cb(null);
        }
        _hook.triggerBuildDoNothingHook(buildConfig, data, (error) => {
            if (error) {
                return cb(error);
            }
            if (data.hasProcess) {
                return cb(null);
            }
            log_1.default.info(`忽略文件: ${data.inputFilePath}`);
            cb(null);
        });
    });
    _async.waterfall(queue, (error) => {
        if (error) {
            console.log(error);
            console.log(`process error: ${data.inputFilePath}`.red);
        }
        next(error);
    });
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
            outRelativeDir: buildConfig.outRelativeDir,
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
/**
 * @params: buildConfig <Object> 编译参数
 * @params: finish <Function> 回调函数， 接收一个参数
*/
function normalExecute(buildConfig, finish) {
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
        compilerFileQueue(buildConfig, fileQueue, next);
    });
    /**/
    //处理额外的文件， 比如html中提取出来的js src， css link等文件合并
    queue.push((buildConfig, next) => {
        _async.map(buildConfig.__extra, (fileData, cb) => {
            compileFile(buildConfig, fileData, cb);
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
exports.normalExecute = normalExecute;
/**
 * 编译单个文件
 */
function singleBuild(buildConfig, filepath, finish) {
    //确保编译目录存在
    _fs.ensureDirSync(buildConfig.outdir);
    let realPath = _path.join(_workspace, filepath);
    if (!_fs.existsSync(realPath) || realPath.indexOf(_workspace) == -1) {
        return finish(new Error('编译文件在项目中找不到'));
    }
    let fileName = realPath.split(_path.sep).pop();
    let fileData = {
        inputFilePath: realPath,
        outputFilePath: _path.join(buildConfig.outdir, filepath),
        outdir: buildConfig.outdir,
        outRelativeDir: buildConfig.outRelativeDir,
        inputFileRelativePath: filepath,
        outputFileRelativePath: _path.join(buildConfig.outRelativeDir, filepath),
        fileName: fileName,
        appendFile: false,
        ignore: false
    };
    compileFile(buildConfig, fileData, finish);
}
function once() {
    let __starTime = Date.now();
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
        normalExecute(_init.getBuildConfig(), (error) => {
            //编译成功
            if (!error) {
                console.log("build success".green);
                return console.log(`编译用时: ${Date.now() - __starTime}ms`);
            }
            //编译失败
            log_1.default.error(error);
            log_1.default.error("build fail".red);
            _hook.triggerBuildErrorHook(error);
            //是否需要退出进程
            process.exit(1);
        });
    });
}
exports.once = once;
