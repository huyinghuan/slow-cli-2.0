"use strict";
const _express = require('express');
const _http = require('http');
const _hooks = require('./hooks/index');
const map_1 = require('./hooks/map');
const startServer = function (app, cli, router) {
    //let app = _express();
    app.use(router);
    let _server = _http.createServer(app);
    _server.on('error', (error) => {
        if (error.code == 'EADDRINUSE') {
            console.log("端口冲突，请使用其它端口".red);
            return process.exit(1);
        }
        console.log(error);
    });
    console.log(`server listen at port ${cli.port}`.green);
    _server.listen(app.listen(cli.port));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => {
    let cli = global.__CLI;
    let app = _express();
    let router = _express.Router();
    //增加一些基础信息
    router.all('*', function (req, resp, next) {
        //挂载时间点
        req.__acceptTime = Date.now();
        //显示请求耗费时间
        resp.on('finish', () => {
            let startTime = req.__acceptTime;
            let spellTime = new Date().getTime() - startTime;
            let msg = `( ${req.url} ) : ${spellTime} ms : [${resp.statusCode}]`;
            switch (resp.statusCode) {
                case 200:
                case 304:
                    console.log(msg.grey);
                    break;
                case 401:
                case 403:
                case 404:
                case 500:
                    console.log(msg.red);
                    break;
                default:
                    console.log(msg.gray);
            }
        });
        next();
    });
    //启动服务器之前
    //_hooksMap.route.initial
    if (_hooks.triggerRouterHook(router)) {
        return;
    }
    //加载编译其他hooks
    router.all('*', function (req, resp, next) {
        let queue = [];
        queue.push((cb) => {
            _hooks.triggerHook(map_1.default.route.didRequest, cb);
        });
        queue.push((respsoneContent) => { });
    });
    //需要发其他
    startServer(app, cli, router);
};
