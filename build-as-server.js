"use strict";
const _express = require('express');
const _http = require('http');
const _hook = require('./hooks/index');
const _plugin = require('./plugin/index');
const log_1 = require('./lib/log');
const _build = require('./build');
const _path = require('path');
const _init = require('./init/index');
const _fse = require('fs-extra');
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
    //编译所有
    router.get('/all', (req, resp) => {
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
        let buildConfig = _init.getBuildConfig();
        buildConfig.outdir = outdir;
        _build.normalExecute(buildConfig, (error) => {
            if (error) {
                console.log(error);
                resp.status(500);
                resp.send({ msg: "编译失败！" });
            }
            else {
                resp.status(200);
                console.log(`编译完成`);
                resp.send({ msg: "编译成功！" });
            }
        });
    });
    app.use(router);
    let _server = _http.createServer(app);
    log_1.default.info(`Build Server listen at port ${port}`.green);
    _server.listen(app.listen(port));
};
function default_1(port) {
    //加载插件
    _plugin.scanPlugins('build');
    startBuildServer(port);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
