"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _path = require("path");
const _ = require("lodash");
const _fs = require("fs");
const config_filed_constant_1 = require("../../../config-filed-constant");
exports.registerPlugin = function (cli) {
    cli.registerHook('preview:notFound', function (req, resp, cb) {
        let workspace = config_filed_constant_1.default.getWorkspace();
        let path = req.path;
        if (path == '/') {
            path = `/${cli.options.index}`;
        }
        let responseFilePath = _path.join(workspace, _.compact(path.split('/')).join(_path.sep));
        if (_fs.existsSync(responseFilePath)) {
            resp.sendFile(responseFilePath);
            return cb(true);
        }
        cb(false);
    });
};
