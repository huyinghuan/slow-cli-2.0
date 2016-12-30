"use strict";
const log_1 = require("./log");
const _child = require("child_process");
const _ = require("lodash");
//执行命令
function executeCommand(command, setting, cb) {
    let options = {
        env: process.env,
        maxBuffer: 20 * 1024 * 1024
    };
    if (_.isFunction(setting)) {
        cb = setting;
    }
    else if (_.isPlainObject(setting)) {
        _.extend(options, setting);
    }
    let stdout = '';
    let stderr = '';
    let exec = _child.exec(command, options);
    exec.on('close', (code) => {
        log_1.default.info(stdout);
        log_1.default.error(stderr);
        if (code != 0) {
            log_1.default.error(`执行命令出错 -> ${command}`.red);
            return cb(`执行命令出错 -> ${command}`);
        }
        cb(null);
    });
    exec.stdout.on('data', (message) => {
        stdout += message;
    });
    exec.stderr.on('data', (message) => {
        stdout += message;
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = executeCommand;
