"use strict";
const _project = require('../project');
//上传配置
const updateload = function (projdectName) {
    if (!projdectName) {
        console.log('非silky项目无法上传');
    }
};
function default_1(_commander) {
    _commander.command('config <actionName>')
        .description('上传或者同步配置文件 up or sync ')
        .option('-u, --url', '指定配置存储服务器地址')
        .action((actionName, program) => {
        let packageJSOn = _project.getProjectPackageJSON();
        if (actionName == "up") {
        }
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
