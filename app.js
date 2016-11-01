"use strict";
const _express = require('express');
const _http = require('http');
const _async = require('async');
const _fs = require('fs');
const _path = require('path');
const _ = require('lodash');
const _hooks = require('./hooks/index');
const getMime_1 = require('./lib/getMime');
const startServer = function (app, cli, router) {
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
    //拦截GET请求，并且加载编译其他hooks 
    router.get('*', function (req, resp, next) {
        let queue = [];
        queue.push((cb) => {
            _hooks.triggerHttpCompilerHook(req, cb);
        });
        //TODO  min js,css, html, autoprefix 
        //编译内容的加工处理
        queue.push((data, responseContent, cb) => {
            if (data.status !== 200) {
                return cb(null, data, responseContent);
            }
            _hooks.triggerHttpResponseHook(req, responseContent, (error, processContent) => {
                cb(error, data, processContent);
            });
        });
        // outout mime and 
        queue.push((data, responseContent, cb) => {
            //文件没有经过任何处理。
            if (data.status == 404) {
                return cb(null);
            }
            let mime = getMime_1.default(req.path);
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
        let path = req.path;
        if (path == '/') {
            path = `/${global.__CLI.index}`;
        }
        let responseFilePath = _path.join(process.cwd(), _.compact(path.split('/')).join(_path.sep));
        if (_fs.existsSync(responseFilePath)) {
            resp.sendFile(responseFilePath);
            return;
        }
        _hooks.triggerHttpNoFoundHook(req, resp, (hasProcess) => {
            if (!hasProcess) {
                resp.sendStatus(404);
            }
        });
    });
    //启动静态服务器
    startServer(app, cli, router);
};
