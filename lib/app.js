"use strict";
const _express = require('express');
const _http = require('http');
const _hooks = require('./hooks/index');
const startServer = function (cli, router) {
    let app = _express();
    app.use(router);
    let _server = _http.createServer(app);
    _server.on('error', (error) => {
        if (error.code == 'EADDRINUSE') {
            console.log("端口冲突，请使用其它端口".red);
            return process.exit(1);
        }
        console.log(error);
    });
    _server.listen(app.listen(cli.port));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (cli) => {
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
                case 200, 304: console.log(msg);
                case 401, 403, 404, 500: console.error(msg);
                default:
                    console.log(msg);
            }
        });
    });
    //启动服务器之前
    //_hooksMap.route.initial
    _hooks.triggerRouterHook(router, (stop) => {
        if (stop) {
            app.use(router);
            return;
        }
        startServer(cli, router);
    });
};
