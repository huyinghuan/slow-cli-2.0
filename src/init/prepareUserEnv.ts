import generatorDefaultConfig from './generatorDefaultConfig';
import _configFiledConstant from '../config-filed-constant';
import * as _fs from 'fs-extra';
import * as _project from '../project';
/**
 * 准备用户环境，配置等
 */
export default function prepareUserEnv(){
  let config = {}
  let defaultConfig = generatorDefaultConfig();
  if(!_fs.existsSync(_configFiledConstant.CLIConfigFile)){
    console.log(`非 ${_configFiledConstant.infinity} 项目， 仅启用静态服务器功能`);
    config = defaultConfig
  }else{
    //读取项目目录下的package.json
    //读取package.json下用户自定义配置
    config = _project.getProjectPackageJSON()
  }
  //如果package.json里面没有相关配置，那么则使用默认配置。
  (global as any).__CLI = config[_configFiledConstant.infinity] || defaultConfig[_configFiledConstant.infinity];
  (global as any).__CLI.pluginsConfig = config[_configFiledConstant.pluginConfigField];
  (global as any).__CLI.buildConfig = config[_configFiledConstant.buildField] || defaultConfig[_configFiledConstant.buildField];
}
