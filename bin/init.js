"use strict";
//查询项目配置
const getProjectConfig = (projectName, cb) => {
};
/**
 * 必须包含的信息
 * 项目名：   name      default: 文件夹名称
 * 项目版本： version   default: 1.0
 * silky-version：     defalut： 依赖于初始化silky版本
 * silky-plugin：      default: {}
 *
 */
function default_1(_commander) {
    _commander.command('init')
        .description('初始化')
        .option('-p, --pluginList <value>', '根据插件列表名称获取插件列表')
        .action((program) => {
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
