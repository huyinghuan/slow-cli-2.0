import _config from '../file-config';
import * as _fs from 'fs-extra';
import * as _path from 'path';

import generatorDefaultConfig from './generatorDefaultConfig';
import getRemoteServerProjectPluginConfig from './getRemoteServerProjectPluginConfig';
import setPluginConfig from './setPluginConfig';

const _globalConfig = {
  port: 14422,
  index: 'index.html',
  pluginConfig: {}
}


//准备plugin环境
export function prepareBaseEnv(){
  
}

//返回packageJson内容
export function getProjectPackageJSON(){
  if(!_fs.existsSync(_config.CLIConfigFile)){
    return {}
  }
  return require(_config.CLIConfigFile)
}

/**
 * 准备用户环境，配置等
 */
export function prepareUserEnv(){

  if(!_fs.existsSync(_config.CLIConfigFile)){
    console.log(`非 ${_config.infinity} 项目， 仅启用静态服务器功能`);
    let defaultConfig =  generatorDefaultConfig();
    (global as any).__CLI = defaultConfig[_config.infinity];
    (global as any).__CLI .pluginsConfig = defaultConfig[_config.pluginConfigField];
    return;
  }
  //读取项目目录下的package.json
  //读取package.json下用户自定义配置
  let packageJSON = getProjectPackageJSON();
  (global as any).__CLI = packageJSON[_config.infinity];
  (global as any).__CLI.pluginsConfig = packageJSON[_config.pluginConfigField];
}

export {generatorDefaultConfig as generatorDefaultConfig}
export {getRemoteServerProjectPluginConfig as getRemoteServerProjectPluginConfig}
export {setPluginConfig as setPluginConfig}