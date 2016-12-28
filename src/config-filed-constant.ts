import * as _os from 'os';
import * as _path from 'path';

/**
 * 仅用于记录文件位置
 */

class ConstantFiled {
  private cwd = process.cwd();
  private configServer = "";
  private infinity = 'silky';
  private pluginConfigField = `${this.infinity}-plugin`;//silky-plugin
  private  pluginVersionField = `${this.infinity}-version`;//silky-version
  private pluginDir = _path.join(this.cwd, 'node_modules'); //插件目录
  private CLIConfigFile = _path.join(this.cwd, 'package.json');//配置文件
  private buildField = `${this.infinity}-build`; //build 相关配置】//silky-build
  private environmentRootDir = _path.join(this.cwd, `.${this.infinity}`);
  private prerequisiteEnvironment = ['production', 'develop', 'normal'];
  private normalEnviromentDir = _path.join(this.cwd, `.${this.infinity}`, 'normal')
  constructor(){}
  setWorkspace(workspace){
    if(!workspace) return;
    this.cwd = process.cwd();
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
      configServer: this.configServer,
      infinity: this.infinity,
      pluginConfigField: this.pluginConfigField,
      pluginVersionField: this.pluginVersionField,
      pluginDir: this.pluginDir, //插件目录
      CLIConfigFile: this.CLIConfigFile, //插件配置文件
      buildField: this.buildField, //build 相关配置】//silky-build
      environmentRootDir: this.environmentRootDir,
      prerequisiteEnvironment: this.prerequisiteEnvironment,
      normalEnviromentDir: this.normalEnviromentDir
    }
  }
}

export default new ConstantFiled();