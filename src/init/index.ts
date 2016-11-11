import _config from '../file-config';
import * as _fs from 'fs-extra';
import * as _path from 'path';
import * as _ from 'lodash';
import generatorDefaultConfig from './generatorDefaultConfig';
import getRemoteServerProjectPluginConfig from './getRemoteServerProjectPluginConfig';
import setPluginConfig from './setPluginConfig';
import checkBuildArgs from './checkBuildArgs';
import checkStartArgs from './checkStartArgs';

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
  let config = {}
  let defaultConfig = generatorDefaultConfig();
  if(!_fs.existsSync(_config.CLIConfigFile)){
    console.log(`非 ${_config.infinity} 项目， 仅启用静态服务器功能`);
    config = defaultConfig
  }else{
    //读取项目目录下的package.json
    //读取package.json下用户自定义配置
    config = getProjectPackageJSON()
  }
  //如果package.json里面没有相关配置，那么则使用默认配置。
  (global as any).__CLI = config[_config.infinity] || defaultConfig[_config.infinity];
  (global as any).__CLI.pluginsConfig = config[_config.pluginConfigField];
  (global as any).__CLI.buildConfig = config[_config.buildField] || defaultConfig[_config.buildField];
}


export function setBuildParams(userInputAgruments){
  _.extend((global as any).__CLI.buildConfig, userInputAgruments)
}

export function setStartParams(userInputAgruments){
  _.extend((global as any).__CLI, userInputAgruments)
}

export function getBuildConfig(){
  return (global as any).__CLI.buildConfig
}

export function getPluginConfig(){
  return (global as any).__CLI.pluginsConfig
}

export function getFullConfig(){
  return (global as any).__CLI
}

export {
  generatorDefaultConfig as generatorDefaultConfig,
  getRemoteServerProjectPluginConfig as getRemoteServerProjectPluginConfig,
  setPluginConfig as setPluginConfig,
  checkBuildArgs as checkBuildArgs,
  checkStartArgs as checkStartArgs
}
