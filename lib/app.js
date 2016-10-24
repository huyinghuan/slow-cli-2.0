"use strict";
const _express = require('express');
const _http = require('http');
const _hooks = require('./hooks/index');
const startServer = function (cli) {
    let app = _express();
    let router = app.route;
    let _server = _http.createServer(app);
    _server.on('error', (error) => {
        if (error.code == 'EADDRINUSE') {
            console.log("端口冲突，请使用其它端口".red);
            return process.exit(1);
        }
        console.log(error);
    });
    _server.listen(app.listen(3000));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (cli) => {
    let app = _express();
    let router = _express.Router();
    //启动服务器之前
    //_hooksMap.route.initial
    _hooks.triggerRouterHook(router, (stop) => {
        if (stop) {
            return;
        }
        startServer(cli);
    });
};
