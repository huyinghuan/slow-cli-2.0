"use strict";
const _path = require("path");
const _ = require("lodash");
const _fs = require("fs");
exports.registerPlugin = function (cli) {
    cli.registerHook('route:notFound', function (req, resp, cb) {
        let path = req.path;
        if (path == '/') {
            path = `/${cli.options.index}`;
        }
        let responseFilePath = _path.join(process.cwd(), _.compact(path.split('/')).join(_path.sep));
        if (_fs.existsSync(responseFilePath)) {
            resp.sendFile(responseFilePath);
            return cb(true);
        }
        cb(false);
    });
};
