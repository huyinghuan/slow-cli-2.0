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
const _ = require("lodash");
const _hooks = require("./hooks/index");
const getMime_1 = require("./lib/getMime");
const config_filed_constant_1 = require("./config-filed-constant");
const _plugin = require("./plugin/index");
const getGitHash_1 = require("./lib/getGitHash");
const _init = require("./init/index");
const _httpUtils = require("./http-utils");
/**
 * 启动静态服务
 */
function privewServer() {
    _plugin.scanPlugins('preview'); //加载插件
    let globalCLIConfig = config_filed_constant_1.default.getGlobal();
    let gitHash = getGitHash_1.default();
    return _http.createServer((request, response) => __awaiter(this, void 0, void 0, function* () {
        _httpUtils.showResponseTime(request, response);
        let requestData = _httpUtils.parseURL(request.url);
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
    //读取用户自定义配置
    _init.prepareUserEnv(workspace);
    //读取运行时环境配置
    _init.prepareRuntimeEnv(enviroment || "production");
    _init.setRunType("preview");
    config_filed_constant_1.default.setBuildParams({ outdir: viewDir });
    let app = privewServer();
    console.log(`run on ${port} at ${workspace} as ${enviroment}`.green);
    app.listen(port);
}
