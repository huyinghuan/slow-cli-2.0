"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _request = require("request");
const public_1 = require("../public");
const getCLIVersion_1 = require("./getCLIVersion");
const log_1 = require("./log");
function default_1() {
    let latestQueryURLPrivate = public_1.default.private_npm_registry + "/silky-reborn/latest";
    let latestQueryURLPublic = "https://registry.npm.taobao.org/silky-reborn/latest";
    let nowVersion = getCLIVersion_1.default();
    _request(latestQueryURLPrivate, (err, httpResponse, body) => {
        if (!err && httpResponse.statusCode == 200) {
            body = JSON.parse(body);
            if (body.version != nowVersion) {
                log_1.default.info(`silky 存在新版本: ${body.version}\n推荐升级[Mac或Linux 前面 加sudo]：mgtv install -g silky-reborn `.blue);
            }
            return;
        }
        _request(latestQueryURLPublic, (err, httpResponse, body) => {
            if (!err && httpResponse.statusCode == 200) {
                body = JSON.parse(body);
                if (body.version != nowVersion) {
                    log_1.default.info(`silky 存在新版本:${body.version}, 推荐升级：npm install -g silky-reborn [mac 前面 加sudo]`.blue);
                }
                return;
            }
        });
    });
}
exports.default = default_1;
