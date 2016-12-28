"use strict";
const _path = require("path");
/**
 * 仅用于记录文件位置
 */
class ConstantFiled {
    constructor() {
        this.cwd = process.cwd();
        this.configServer = "";
        this.infinity = 'silky';
        this.pluginConfigField = `${this.infinity}-plugin`; //silky-plugin
        this.pluginVersionField = `${this.infinity}-version`; //silky-version
        this.pluginDir = _path.join(this.cwd, 'node_modules'); //插件目录
        this.CLIConfigFile = _path.join(this.cwd, 'package.json'); //配置文件
        this.buildField = `${this.infinity}-build`; //build 相关配置】//silky-build
        this.environmentRootDir = _path.join(this.cwd, `.${this.infinity}`);
        this.prerequisiteEnvironment = ['production', 'develop', 'normal'];
        this.normalEnviromentDir = _path.join(this.cwd, `.${this.infinity}`, 'normal');
    }
    setWorkspace(workspace) {
        if (!workspace)
            return;
        this.cwd = process.cwd();
        this.update();
    }
    update() {
        this.pluginDir = _path.join(this.cwd, 'node_modules'); //插件目录
        this.CLIConfigFile = _path.join(this.cwd, 'package.json'); //配置文件
        this.environmentRootDir = _path.join(this.cwd, `.${this.infinity}`);
        this.normalEnviromentDir = _path.join(this.cwd, `.${this.infinity}`, 'normal');
    }
    get() {
        return {
            configServer: this.configServer,
            infinity: this.infinity,
            pluginConfigField: this.pluginConfigField,
            pluginVersionField: this.pluginVersionField,
            pluginDir: this.pluginDir,
            CLIConfigFile: this.CLIConfigFile,
            buildField: this.buildField,
            environmentRootDir: this.environmentRootDir,
            prerequisiteEnvironment: this.prerequisiteEnvironment,
            normalEnviromentDir: this.normalEnviromentDir
        };
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new ConstantFiled();
