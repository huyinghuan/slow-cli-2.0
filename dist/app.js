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
const config_filed_constant_1 = require("./config-filed-constant");
const _hooks = require("./hooks/index");
const getMime_1 = require("./lib/getMime");
const _plugin = require("./plugin/index");
const log_1 = require("./lib/log");
const _httpUtils = require("./http-utils");
/**
 * 启动静态服务
 */
exports.default = () => {
    //加载插件
    _plugin.scanPlugins('route');
    let globalCLIConfig = config_filed_constant_1.default.getGlobal();
    return (request, response) => __awaiter(this, void 0, void 0, function* () {
        _httpUtils.showResponseTime(request, response);
        //启动服务器之前
        let stop = yield _hooks.triggerRouter("initial", request, response);
        if (stop) {
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
            query: requestData.query,
            __request: request
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
        try {
            //路径转发
            yield _hooks.triggerRouter("forward", req, data);
            let content = yield _hooks.triggerRouter("didRequest", req, data);
            content = yield _hooks.triggerRouter("willResponse", req, data, content);
            if (data.stats != 404 && content) {
                let responseMimeType = data.ContentType || getMime_1.default(data.realPath);
                response.writeHead(200, { 'Content-Type': responseMimeType });
                response.write(content, "utf8");
                response.end();
                return;
            }
        }
        catch (e) {
            log_1.default.error(e);
            response.statusCode = 500;
            response.end("server error");
            return;
        }
        //404 nofound
        let hasProcess = yield _hooks.triggerRouter("notFound", req, response);
        if (!hasProcess) {
            response.statusCode = 404;
            response.statusMessage = "no file";
            response.end("404 no file");
        }
    });
};
