"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generatorDefaultConfig_1 = require("./generatorDefaultConfig");
const config_filed_constant_1 = require("../config-filed-constant");
const _fs = require("fs-extra");
const _project = require("../project");
/**
 * 准备用户环境，配置等
 * params <pure> boolean, 纯净模式，不加载任何插件
 */
function prepareUserEnv(workspace, pure) {
    workspace = workspace || process.cwd();
    //设置工作根目录
    config_filed_constant_1.default.setWorkspace(workspace);
    let config = {};
    let defaultConfig = generatorDefaultConfig_1.default();
    let configFiledConstant = config_filed_constant_1.default.get();
    if (!_fs.existsSync(configFiledConstant.CLIConfigFile) || pure) {
        console.log(`非 ${configFiledConstant.infinity} 项目， 启用纯净模式<不加载任何插件>`);
        config = defaultConfig;
    }
    else {
        //读取项目目录下的package.json
        //读取package.json下用户自定义配置
        config = _project.getProjectPackageJSON();
    }
    //如果package.json里面没有相关配置，那么则使用默认配置。
    config_filed_constant_1.default.setGlobal(config[configFiledConstant.infinity] || defaultConfig[configFiledConstant.infinity]);
    config_filed_constant_1.default.setGlobal({ pluginsConfig: config[configFiledConstant.pluginConfigField] });
    config_filed_constant_1.default.setGlobal({ buildConfig: config[configFiledConstant.buildField] || defaultConfig[configFiledConstant.buildField] });
    config_filed_constant_1.default.setGlobal({ pubModulesDir: config[configFiledConstant.pubModulesDir] || defaultConfig[configFiledConstant.pubModulesDir] });
}
exports.default = prepareUserEnv;
