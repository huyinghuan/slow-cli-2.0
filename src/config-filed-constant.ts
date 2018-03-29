import * as _os from 'os';
import * as _path from 'path';
import * as _ from 'lodash';
import * as _fs from 'fs'
/**
 * 仅用于记录文件位置
 */

class ConstantFiled {
  private cwd = process.cwd();
  private configServer = "";
  private infinity = 'silky';
  private pluginConfigField = `${this.infinity}-plugin`;//silky-plugin
  private pluginVersionField = `${this.infinity}-version`;//silky-version
  private pluginDir = _path.join(this.cwd, 'node_modules'); //插件目录
  private CLIConfigFile = _path.join(this.cwd, 'package.json');//配置文件
  private buildField = `${this.infinity}-build`; //build 相关配置】//silky-build
  private environmentRootDir = _path.join(this.cwd, `.${this.infinity}`);
  private prerequisiteEnvironment = ['production', 'develop', 'normal'];
  private normalEnviromentDir = _path.join(this.cwd, `.${this.infinity}`, 'normal');
  private pubModulesDir = `${this.infinity}-pubPath`
  //存储全局变量
  private globalVar:any = {
    projectName: "",
    index: "index.html",
    autoindex: false,
    enviroment: "develop",
    port: 14422,
    buildConfig: {},
    pluginsConfig:{},
    pubModulesDir: "node_modules",
    runType: "" //可选: tool, preview
  };
  constructor(){
    if(_fs.existsSync(this.CLIConfigFile)){
      let CLIConfig = require(this.CLIConfigFile)
      this.globalVar.projectName = CLIConfig.name
    }
  }
  getWorkspace(){return this.cwd}
  setWorkspace(workspace){
    if(!workspace) return;
    this.cwd = workspace;
    this.update();
  }
  update(){
    this.pluginDir = _path.join(this.cwd, 'node_modules'); //插件目录
    this.CLIConfigFile = _path.join(this.cwd, 'package.json');//配置文件
    this.environmentRootDir = _path.join(this.cwd, `.${this.infinity}`);
    this.normalEnviromentDir = _path.join(this.cwd, `.${this.infinity}`, 'normal')
  }
  get(){
    return {
      env: this.globalVar.enviroment,
      configServer: this.configServer,
      infinity: this.infinity,
      pluginConfigField: this.pluginConfigField,
      pluginVersionField: this.pluginVersionField,
      pluginDir: this.pluginDir, //插件目录
      CLIConfigFile: this.CLIConfigFile, //插件配置文件
      buildField: this.buildField, //build 相关配置】//silky-build
      environmentRootDir: this.environmentRootDir,
      prerequisiteEnvironment: this.prerequisiteEnvironment,
      normalEnviromentDir: this.normalEnviromentDir,
      pubModulesDir: this.pubModulesDir
    }
  }

  //全局变量
  getGlobal(field?:string):any{
    if(!field){return this.globalVar}
    return this.globalVar[field];
  }

  setGlobal(obj){
    _.extend(this.globalVar, obj)
  }

  getEnviroment(){
    return {
      enviroment: (this.globalVar as any).enviroment,
      enviromentDir:  (this.globalVar as any).enviromentDir
    }
  }

  setBuildParams(params){
    if(!this.globalVar.buildConfig){
      this.globalVar.buildConfig = {}
    }
    _.extend(this.globalVar.buildConfig, params)
  }

  getBuildConfig(field?:any):any{
    if(!field){return this.globalVar.buildConfig}

    if(_.isString(field)){
      return  this.globalVar.buildConfig[field]
    }

    if(_.isPlainObject(field)){
      return _.extend({}, this.globalVar.buildConfig, field)
    }

    return this.globalVar.buildConfig
  }
  getPluginConfig(field?){
    if(!field){return this.globalVar.pluginsConfig}
     if(_.isString(field)){
      return  this.globalVar.pluginsConfig[field]
    }
    return this.globalVar.pluginsConfig
  }
}

export default new ConstantFiled();