"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const _fs = require("fs-extra");
const _initUtils = require("../init/index");
const config_filed_constant_1 = require("../config-filed-constant");
const _project = require("../project");
const _init = require("../init/index");
const _binConfig = require("./config");
function execute(program) {
    return __awaiter(this, void 0, void 0, function* () {
        //读取用户自定义配置
        _init.prepareUserEnv(program.workspace);
        //bu s
        let packageJSON = _project.getProjectPackageJSON();
        let configFiledConstant = config_filed_constant_1.default.get();
        let generatorConfig = null;
        if (program.projectName) {
            yield _binConfig.sync(program);
            generatorConfig = _project.getProjectPackageJSON();
        }
        else {
            generatorConfig = _initUtils.generatorDefaultConfig();
        }
        if (program.projectName) {
            delete packageJSON[configFiledConstant.pluginConfigField];
        }
        Object.keys(packageJSON).forEach((key) => {
            if (generatorConfig[key]) {
                generatorConfig[key] = _.extend(generatorConfig[key], packageJSON[key]);
            }
            else {
                generatorConfig[key] = packageJSON[key];
            }
        });
        _fs.writeJSONSync(configFiledConstant.CLIConfigFile, generatorConfig);
    });
}
exports.execute = execute;
/* istanbul ignore next  */
function commander(_commander) {
    _commander.command('init')
        .description('初始化')
        .option('-p, --projectName <value>', '根据插件列表名称获取插件列表')
        .option('-w, --workspace <value>', '指定工作目录')
        .action((program) => __awaiter(this, void 0, void 0, function* () {
        yield execute(program);
        console.log('初始化成功！ 安装插件请运行命令 silky install'.green);
    }));
}
exports.commander = commander;
