"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _request = require("request");
const getCLIVersion_1 = require("./getCLIVersion");
const _os = require("os");
const _project = require("../project");
function default_1(type = 'start', status) {
    let nowVersion = getCLIVersion_1.default();
    let url = "https://silky.mytools.bid/api/log";
    _request({ url: url, method: "POST", json: {
            silky_version: nowVersion,
            os_platform: _os.platform(),
            os_arch: _os.arch(),
            os_release: _os.release(),
            node_version: process.version,
            username: process.env.USER || process.env.USERNAME,
            project_name: _project.getProjectPackageJSONField('name'),
            type: type,
            status: status
        } }, (err, httpResponse, body) => { });
}
exports.default = default_1;
