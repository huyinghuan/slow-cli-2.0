'use strict';
const _fs = require('fs');
const _ = require('lodash');
exports.registerPlugin = (cli, options) => {
    cli.registerHook('build:doNothing', function (buildConfig, data, cb) {
        if (!_.isString(data.outputFilePath)) {
            return cb("禁止copy两个相同文件");
        }
        cli.utils.ensureFileSync(data.outputFilePath);
        var rd = _fs.createReadStream(data.inputFilePath);
        rd.on("error", function (err) { cb(err); });
        var wr = _fs.createWriteStream(data.outputFilePath);
        rd.pipe(wr);
        wr.on("close", function (ex) {
            if (ex) {
                return cb(ex);
            }
            cli.log.info(`copy ${data.inputFileRelativePath} -> ${data.outputFileRelativePath} `);
            data.hasProcess = true;
            cb(null, data);
        });
    }, 1000);
};
