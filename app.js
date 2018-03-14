"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _express = require("express");
const config_filed_constant_1 = require("./config-filed-constant");
const _hooks = require("./hooks/index");
const _plugin = require("./plugin/index");
const _httpUtils = require("./http-utils");
/**
 * 启动静态服务
 */
exports.default = () => {
    //加载插件
    _plugin.scanPlugins('route');
    let app = _express();
    let router = _express.Router();
    let globalCLIConfig = config_filed_constant_1.default.getGlobal();
    return (request, response) => __awaiter(this, void 0, void 0, function* () {
        _httpUtils.showResponseTime(request, response);
        //启动服务器之前
        if (_hooks.triggerRouter("initial", router)) {
            return;
        }
        let requestData = _httpUtils.parseURL(request.url);
        //拦截文件夹请求
        let isDir = yield _httpUtils.isDir(requestData.path);
        if (isDir) {
            let content = yield _hooks.triggerRouter("dir", requestData.path);
            if (content) {
                response.setHeader('Content-Type', "text/html");
                response.write(content, "utf8");
                response.end();
                return;
            }
        }
        //基本数据
        let req = {
            path: requestData.path,
            query: requestData.query
        };
        //拦截GET请求，并且加载编译其他hooks
        let realPath = requestData.path;
        if (realPath == '/') {
            realPath = globalCLIConfig.index || "index.html";
        }
        let data = {
            status: 404,
            realPath: realPath
        };
        //路径转发
        yield _hooks.triggerRouter("forward", req, data);
        let content = yield _hooks.triggerRouter("didRequest", req, data);
        content = _hooks.triggerRouter("willResponse", req, data, content);
        //404 nofound
        let hasProcess = yield _hooks.triggerRouter("notFound", req, response);
        if (!hasProcess) {
            response.statusCode = 404;
            response.statusMessage = "no file";
            response.end("404 no file");
        }
    });
    // //拦截GET请求，并且加载编译其他hooks
    // router.all('*', function (request, resp, next){
    //   queue.push((cb:CompilerCallBack)=>{
    //     _hooks.triggerRouter("didRequest", req, data, cb)
    //   });
    //   //TODO  min js,css, html, autoprefix
    //   //対编译后内容的加工处理
    //   queue.push((responseContent, cb)=>{
    //     _hooks.triggerRouter("willResponse", req, data, responseContent, cb)
    //   });
    //   // outout mime and responseContent
    //   queue.push((responseContent, cb)=>{
    //     //文件没有经过任何编译工具处理。
    //     if(data.status == 404){
    //       return cb(null)
    //     }
    //     let mime = _getMime(data.   );
    //     let responseMimeType = data.ContentType || mime;
    //     resp.set('Content-Type', responseMimeType);
    //     resp.send(responseContent)
    //     cb(null, true)
    //   })
    //   _async.waterfall(queue, (error, hasProcess)=>{
    //     if(error){
    //       console.log(error)
    //       resp.status(500)
    //       resp.send(error)
    //     }else{
    //       //交给自带的静态文件处理
    //       if(!hasProcess){
    //         next();
    //       }
    //     }
    //   })
    // });
    // app.use(router)
    //return app
};
