"use strict";
const _projectUtils = require('../lib/project');
const file_config_1 = require('../file-config');
/**
 * 用户写入到项目目录下的package.json文件中。
 * 必须包含的信息
 * 项目名：   name      default: 文件夹名称
 * 项目版本： version   default: 1.0 项目版本
 * cli-version：     defalut： 依赖于初始化 cli 版本
 * cli-plugin：      default: {} //插件配置，和插件启用状态
 * cli:              default: cli 默认配置
 * cli-build:       default:{} build配置
 */
function default_1() {
    let result = {};
    result.name = _projectUtils.getProjectDirectoryName();
    result.version = '1.0';
    result[file_config_1.default.pluginVersionField] = _projectUtils.getCLIVersion();
    result[file_config_1.default.pluginConfigField] = {};
    result[file_config_1.default.infinity] = {
        port: 14422
    };
    result[file_config_1.default.buildField] = {
        outdir: './build',
        ignore: ["node_modules", "(\\/\\.[^/]+)$"],
    };
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
