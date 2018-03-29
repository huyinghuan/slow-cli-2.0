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
const _http = require("http");
const _fs = require("fs");
const _url = require("url");
const _querystring = require("querystring");
const _ = require("lodash");
const _hooks = require("./hooks/index");
const getMime_1 = require("./lib/getMime");
const config_filed_constant_1 = require("./config-filed-constant");
const _plugin = require("./plugin/index");
const log_1 = require("./lib/log");
const fortmatContentLength_1 = require("./lib/fortmatContentLength");
const getGitHash_1 = require("./lib/getGitHash");
const _init = require("./init/index");
const showResponseTime = function (req, resp) {
    let startTime = Date.now();
    resp.on('finish', () => {
        let spellTime = Date.now() - startTime;
        let msg = `( ${req.url} ): ${spellTime} ms: [${resp.statusCode}] size:`;
        switch (resp.statusCode) {
            case 304:
                log_1.default.info(msg.grey);
                break;
            case 401:
            case 403:
            case 404:
            case 500:
                log_1.default.error(msg.red);
                break;
            default:
                log_1.default.info(msg.gray, `${fortmatContentLength_1.default(resp._contentLength)}`);
        }
    });
};
const parseURL = function (url) {
    let urlObj = _url.parse(url);
    urlObj.query = _querystring.parse(urlObj.query);
    urlObj.path = urlObj.pathname;
    return urlObj;
};
/**
 * 启动静态服务
 */
function privewServer(healthCheck) {
    _fs.writeFileSync("server-status.dat", healthCheck || 200, "utf8");
    _plugin.scanPlugins('preview'); //加载插件
    let globalCLIConfig = config_filed_constant_1.default.getGlobal();
    let gitHash = getGitHash_1.default();
    return _http.createServer((request, response) => __awaiter(this, void 0, void 0, function* () {
        showResponseTime(request, response);
        let requestData = parseURL(request.url);
        if (requestData.path == "/__health_check") {
            if (request.method == "GET") {
                response.statusCode = ~~_fs.readFileSync("server-status.dat", "utf8");
                response.end();
                return;
            }
            else if (request.method == "PUT") {
                let ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
                //只允许本地更新的不允许远程更新状态
                if (ip.indexOf("127.0.0.1") != -1 || ip == "::1") {
                    let status = requestData.query["status"] || 200;
                    _fs.writeFileSync("server-status.dat", status || 200, "utf8");
                    response.end("更新当前系统状态为:" + status);
                    response.end();
                }
                else {
                    response.statusCode = 401;
                    response.end("不允许远程更新系统状态!!");
                }
            }
        }
        //基本数据
        let req = {
            path: requestData.path,
            query: requestData.query
        };
        let realPath = req.path;
        if (realPath == '/') {
            realPath = globalCLIConfig.index || "index.html";
        }
        let data = {
            status: 404,
            realPath: realPath,
            __gitHash: gitHash
        };
        let fetchDataStartTime = Date.now();
        yield _hooks.triggerPreview('forward', req, data);
        console.log(`fetch Data use: ${Date.now() - fetchDataStartTime}ms`);
        let content = yield _hooks.triggerPreview("compile", req, data);
        if (data.status == 404) {
            response.statusCode = 404;
            response.end();
            return;
        }
        response.setHeader('Content-Type', data.ContentType || getMime_1.default(data.realPath));
        response.write(content, "utf8");
        response.end();
    }));
}
exports.privewServer = privewServer;
if (require.main == module) {
    require('colors');
    let port = _.indexOf(process.argv, "-p") > -1 ? process.argv[_.indexOf(process.argv, "-p") + 1] : 14488;
    let workspace = _.indexOf(process.argv, "-w") > -1 ? process.argv[_.indexOf(process.argv, "-w") + 1] : process.cwd();
    let enviroment = _.indexOf(process.argv, "-e") > -1 ? process.argv[_.indexOf(process.argv, "-e") + 1] : "production";
    let viewDir = _.indexOf(process.argv, "-v") > -1 ? process.argv[_.indexOf(process.argv, "-v") + 1] : "prebuild";
    let HEALTHCHCK = _.indexOf(process.argv, "-c") > -1 ? ~~process.argv[_.indexOf(process.argv, "-c") + 1] : 200;
    //读取用户自定义配置
    _init.prepareUserEnv(workspace);
    //读取运行时环境配置
    _init.prepareRuntimeEnv(enviroment || "production");
    _init.setRunType("preview");
    config_filed_constant_1.default.setBuildParams({ outdir: viewDir });
    let app = privewServer(HEALTHCHCK);
    console.log(`run on ${port} at ${workspace} as ${enviroment}`.green);
    app.listen(port);
}
