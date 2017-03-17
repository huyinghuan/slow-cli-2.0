"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _express = require("express");
const _path = require("path");
const _hook = require("../hooks/index");
const _plugin = require("../plugin/index");
const log_1 = require("../lib/log");
const config_filed_constant_1 = require("../config-filed-constant");
const _fse = require("fs-extra");
const _async = require("async");
const getGitHash_1 = require("../lib/getGitHash");
const executeProjectCompile_1 = require("./executeProjectCompile");
const excuteFileCompile_1 = require("./excuteFileCompile");
const unregisterHooks_1 = require("../hooks/unregisterHooks");
const buildServer = function (prepareFn) {
    let app = _express();
    let router = _express.Router();
    router.all(/^\/((single)|(all)).?/, (req, resp, next) => {
        //挂载时间点
        req.__acceptTime = Date.now();
        //显示请求耗费时间
        resp.on('finish', () => {
            let startTime = req.__acceptTime;
            let spellTime = new Date().getTime() - startTime;
            console.log(`编译耗时:${spellTime}`);
        });
        next();
    });
    //主要做一些接口认证的事
    _hook.triggerBuildServerFilterHook(router);
    router.get(/^\/((single)|(all)).?/, (req, resp, next) => {
        let outdir = req.query.outdir;
        if (!outdir) {
            resp.status(403);
            resp.send({ error: "未指定编译路径" });
            return;
        }
        if (!_path.isAbsolute(outdir)) {
            resp.status(403);
            resp.send({ error: "路径不正确" });
            return;
        }
        ;
        try {
            _fse.ensureDirSync(outdir);
        }
        catch (e) {
            resp.status(403);
            resp.send({ error: "目录不可创建" });
            return;
        }
        next();
    });
    router.get('/single', (req, resp) => {
        let filepath = req.query.filepath;
        let outdir = req.query.outdir;
        if (!filepath) {
            resp.status(403);
            return resp.send({ msg: "缺少查询参数" });
        }
        let queue = [];
        queue.push((next) => {
            getGitHash_1.default(next);
        });
        queue.push((gitHash, next) => {
            let buildConfig = config_filed_constant_1.default.getBuildConfig({
                gitHash: gitHash,
                outdir: outdir,
                __extra: [],
                __del: [] //编译完成后需要删除掉冗余文件
            });
            excuteFileCompile_1.default(buildConfig, filepath, next);
        });
        _async.waterfall(queue, (error) => {
            if (error) {
                console.log(error);
                resp.status(500);
                resp.send({ msg: "编译错误" });
            }
            else {
                resp.sendStatus(200);
            }
        });
    });
    router.get('/reloadHooks', (req, resp, next) => {
        prepareFn((hassError) => {
            if (hassError) {
                resp.status(500);
                return resp.send({ error: "初始化环境失败" });
            }
            else {
                unregisterHooks_1.default();
                _plugin.scanPlugins('build');
                resp.sendStatus(200);
            }
        });
    });
    //编译所有
    router.get('/all', (req, resp) => {
        let outdir = req.query.outdir;
        let queue = [];
        queue.push((next) => {
            getGitHash_1.default(next);
        });
        queue.push((gitHash, next) => {
            let buildConfig = config_filed_constant_1.default.getBuildConfig({
                gitHash: gitHash,
                outdir: outdir
            });
            executeProjectCompile_1.default(buildConfig, next);
        });
        _async.waterfall(queue, (error) => {
            if (error) {
                console.log(error);
                resp.status(500);
                resp.send({ msg: "编译失败！" });
            }
            else {
                resp.status(200);
                console.log(`编译完成`);
                resp.send({ msg: "编译成功！", time: Date.now() - req.__acceptTime });
            }
        });
    });
    app.use(router);
    return app;
};
function default_1(prepareFn) {
    prepareFn((hasError) => { if (hasError) {
        process.exit(1);
    } });
    //加载插件
    _plugin.scanPlugins('build');
    _hook.triggerBuildInitHook((error, stop) => {
        if (error) {
            log_1.default.error(error);
            process.exit(1);
            return;
        }
        if (stop) {
            log_1.default.info(`该项目已被插件接管编译功能，编译服务不适用于该项目`);
            process.exit(0);
            return;
        }
    });
    return buildServer(prepareFn);
}
exports.default = default_1;
