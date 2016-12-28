"use strict";
const _express = require("express");
const _http = require("http");
const _path = require("path");
const _hook = require("../hooks/index");
const _plugin = require("../plugin/index");
const log_1 = require("../lib/log");
const _init = require("../init/index");
const _fse = require("fs-extra");
const _async = require("async");
const getGitHash_1 = require("../lib/getGitHash");
const executeProjectCompile_1 = require("./executeProjectCompile");
const excuteFileCompile_1 = require("./excuteFileCompile");
const startBuildServer = (port) => {
    let app = _express();
    let router = _express.Router();
    router.all('*', (req, resp, next) => {
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
            let buildConfig = _init.getBuildConfig({ gitHash: gitHash });
            buildConfig.outdir = outdir;
            //额外需要编译的文件
            buildConfig.__extra = [];
            //编译完成后需要删除掉冗余文件
            buildConfig.__del = [];
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
    //编译所有
    router.get('/all', (req, resp) => {
        let outdir = req.query.outdir;
        let queue = [];
        queue.push((next) => {
            getGitHash_1.default(next);
        });
        queue.push((gitHash, next) => {
            let buildConfig = _init.getBuildConfig({ gitHash: gitHash });
            buildConfig.outdir = outdir;
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
    let _server = _http.createServer(app);
    console.log(`Build Server listen at port ${port}`.green);
    _server.listen(app.listen(port));
};
function default_1(port) {
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
        startBuildServer(port);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
