"use strict";
const _express = require('express');
const _http = require('http');
const _async = require('async');
const _hooks = require('./hooks/index');
const getMime_1 = require('./lib/getMime');
const _init = require('./init/index');
const _plugin = require('./plugin/index');
const startServer = function (app, cli, router) {
    app.use(router);
    let _server = _http.createServer(app);
    _server.on('error', (error) => {
        if (error.code == 'EADDRINUSE') {
            console.log("端口冲突，请使用其它端口".red);
            return process.exit(1);
        }
        console.log(error);
        return process.exit(1);
    });
    let port = cli.port;
    console.log(`server listen at port ${port}`.green);
    _server.listen(app.listen(port));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => {
    //加载插件
    _plugin.scanPlugins('route');
    let cli = _init.getFullConfig();
    let app = _express();
    let router = _express.Router();
    let globalCLIConfig = _init.getFullConfig();
    //启动静态服务器
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
            _hooks.triggerHttpDidResponseHook(req);
        });
        next();
    });
    //启动服务器之前
    //_hooksMap.route.initial
    if (_hooks.triggerHttpRouterHook(router)) {
        return;
    }
    //拦截GET请求，并且加载编译其他hooks 
    router.get('*', function (req, resp, next) {
        let queue = [];
        let realPath = req.path;
        if (realPath == '/') {
            realPath = globalCLIConfig.index || "index.html";
        }
        let data = {
            status: 404,
            realPath: realPath
        };
        queue.push((cb) => {
            //route:didRequest
            _hooks.triggerHttpCompilerHook(req, data, cb);
        });
        //TODO  min js,css, html, autoprefix 
        //対编译后内容的加工处理
        queue.push((responseContent, cb) => {
            //route:willResponse
            _hooks.triggerHttpWillResponseHook(req, data, responseContent, cb);
        });
        // outout mime and responseContent
        queue.push((responseContent, cb) => {
            //文件没有经过任何编译工具处理。
            if (data.status == 404) {
                return cb(null);
            }
            let mime = getMime_1.default(data.realPath);
            let responseMimeType = data.ContentType || mime;
            resp.set('Content-Type', responseMimeType);
            resp.send(responseContent);
            cb(null, true);
        });
        _async.waterfall(queue, (error, hasProcess) => {
            if (error) {
                console.log(error);
                resp.sendStatus(500);
            }
            else {
                //交给自带的静态文件处理
                if (!hasProcess) {
                    next();
                }
            }
        });
    });
    //如果其他编译hook没有完成编译，那么则使用默认文件发送
    router.get('*', function (req, resp, next) {
        _hooks.triggerHttpNoFoundHook(req, resp, (hasProcess) => {
            if (!hasProcess) {
                resp.sendStatus(404);
            }
        });
    });
    startServer(app, cli, router);
};
