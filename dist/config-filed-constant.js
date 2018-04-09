"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _path = require("path");
const _ = require("lodash");
const _fs = require("fs");
/**
 * 仅用于记录文件位置
 */
class ConstantFiled {
    constructor() {
        this.cwd = process.cwd();
        this.configServer = "";
        this.infinity = 'silky';
        this.pluginConfigField = `silky-plugin`; //silky-plugin
        this.pluginVersionField = `silky-version`; //silky-version
        this.pluginDir = _path.join(this.cwd, 'node_modules'); //插件目录
        this.CLIConfigFile = _path.join(this.cwd, 'package.json'); //配置文件
        this.buildField = `silky-build`; //build 相关配置】//silky-build
        this.environmentRootDir = _path.join(this.cwd, `.silky`);
        this.prerequisiteEnvironment = ['production', 'develop', 'normal'];
        this.normalEnviromentDir = _path.join(this.cwd, `.silky`, 'normal');
        this.pubModulesDir = `silky-pubPath`;
        //存储全局变量
        this.globalVar = {
            projectName: "",
            index: "index.html",
            autoindex: false,
            enviroment: "develop",
            port: 14422,
            buildConfig: {},
            pluginsConfig: {},
            pubModulesDir: "node_modules",
            runType: "" //可选: tool, preview
        };
        if (_fs.existsSync(this.CLIConfigFile)) {
            let CLIConfig = require(this.CLIConfigFile);
            this.globalVar.projectName = CLIConfig.name;
        }
    }
    getWorkspace() { return this.cwd; }
    setWorkspace(workspace) {
        if (!workspace)
            return;
        this.cwd = workspace;
        this.update();
    }
    update() {
        this.pluginDir = _path.join(this.cwd, 'node_modules'); //插件目录
        //配置文件
        this.CLIConfigFile = _path.join(this.cwd, 'package.json');
        this.environmentRootDir = _path.join(this.cwd, `.silky`);
        this.normalEnviromentDir = _path.join(this.cwd, `.silky`, 'normal');
    }
    get() {
        return {
            env: this.globalVar.enviroment,
            configServer: this.configServer,
            infinity: this.infinity,
            pluginConfigField: this.pluginConfigField,
            pluginVersionField: this.pluginVersionField,
            pluginDir: this.pluginDir,
            CLIConfigFile: this.CLIConfigFile,
            buildField: this.buildField,
            environmentRootDir: this.environmentRootDir,
            prerequisiteEnvironment: this.prerequisiteEnvironment,
            normalEnviromentDir: this.normalEnviromentDir,
            pubModulesDir: this.pubModulesDir
        };
    }
    //全局变量
    getGlobal(field) {
        if (!field) {
            return this.globalVar;
        }
        return this.globalVar[field];
    }
    setGlobal(obj) {
        _.extend(this.globalVar, obj);
    }
    getEnviroment() {
        return {
            enviroment: this.globalVar.enviroment,
            enviromentDir: this.globalVar.enviromentDir
        };
    }
    setBuildParams(params) {
        if (!this.globalVar.buildConfig) {
            this.globalVar.buildConfig = {};
        }
        _.extend(this.globalVar.buildConfig, params);
    }
    getBuildConfig(field) {
        if (!field) {
            return this.globalVar.buildConfig;
        }
        if (_.isString(field)) {
            return this.globalVar.buildConfig[field];
        }
        if (_.isPlainObject(field)) {
            return _.extend({}, this.globalVar.buildConfig, field);
        }
        return this.globalVar.buildConfig;
    }
    getPluginConfig(field) {
        if (!field) {
            return this.globalVar.pluginsConfig;
        }
        if (_.isString(field)) {
            return this.globalVar.pluginsConfig[field];
        }
        return this.globalVar.pluginsConfig;
    }
}
exports.default = new ConstantFiled();
