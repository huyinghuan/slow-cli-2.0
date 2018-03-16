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
const log_1 = require("./lib/log");
const fortmatContentLength_1 = require("./lib/fortmatContentLength");
const _url = require("url");
const _querystring = require("querystring");
const _fs = require("fs");
const _path = require("path");
const config_filed_constant_1 = require("./config-filed-constant");
function showResponseTime(req, resp) {
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
}
exports.showResponseTime = showResponseTime;
function parseURL(url) {
    let urlObj = _url.parse(url);
    urlObj.query = _querystring.parse(urlObj.query);
    urlObj.path = urlObj.pathname;
    return urlObj;
}
exports.parseURL = parseURL;
function isDir(path) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            _fs.stat(_path.join(config_filed_constant_1.default.getWorkspace(), path), (error, stat) => {
                if (error) {
                    return resolve(false);
                }
                if (!stat.isDirectory() || !config_filed_constant_1.default.getGlobal('autoindex')) {
                    return resolve(false);
                }
                resolve(true);
            });
        });
    });
}
exports.isDir = isDir;
