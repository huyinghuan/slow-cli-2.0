"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _hooks = require("./hooks/index");
const _plugin = require("./plugin/index");
const getAllFileInProject_1 = require("./lib/getAllFileInProject");
const _async = require("async");
const getGitHash_1 = require("./lib/getGitHash");
const config_filed_constant_1 = require("./config-filed-constant");
const log_1 = require("./lib/log");
const _fs = require("fs-extra");
const _path = require("path");
function precompileFile(buildConfig, fileItem, content, finish) {
    let outpufFilePath = _path.join(buildConfig.outdir, fileItem.relativeDir, fileItem.fileName);
    _fs.ensureFileSync(outpufFilePath);
    let queue = [];
    queue.push((cb) => {
        _hooks.triggerPrecompile('include', buildConfig, fileItem, content, (error, content) => {
            cb(error, content);
        });
    });
    _async.waterfall(queue, (error, content) => {
        if (error) {
            finish(error);
        }
        else {
            _fs.writeFileSync(outpufFilePath, content);
            finish();
        }
    });
}
function compile() {
    _plugin.scanPlugins('precompile');
    //获取所有待编译文件
    let fileQueue = getAllFileInProject_1.default(false);
    let targetFileQueue = [];
    fileQueue.forEach((item) => {
        if (item.fileName.indexOf(".hbs") != -1) {
            targetFileQueue.push(item);
        }
    });
    log_1.default.info(`预编译文件:${targetFileQueue.length}个`);
    let __starTime = Date.now();
    let queue = [];
    let gitHash = getGitHash_1.default();
    let buildConfig = config_filed_constant_1.default.getBuildConfig({ gitHash: gitHash });
    //确保编译目录存在
    _fs.ensureDirSync(buildConfig.outdir);
    //清空编译目录
    _fs.emptyDirSync(buildConfig.outdir);
    _async.map(targetFileQueue, (item, cb) => {
        _fs.readFile(item.filePath, { encoding: "utf8" }, (error, content) => {
            if (error) {
                return cb(error);
            }
            precompileFile(buildConfig, item, content, cb);
        });
    }, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            log_1.default.info(`完成预编译文件:${result.length}个`);
        }
    });
    //_hooks.triggerPrecompile("")
}
exports.compile = compile;
