"use strict";
function default_1(_commander) {
    _commander.command('config <actionName>')
        .description('上传或者同步配置文件 up or sync ')
        .option('-u, --url', '指定配置存储服务器地址')
        .action((program) => {
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
