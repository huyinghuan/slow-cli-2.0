import _configFiledConstant from '../config-filed-constant';
import * as _fs from 'fs-extra';
import * as _path from 'path';
import * as _ from 'lodash';
import generatorDefaultConfig from './generatorDefaultConfig';
import getRemoteServerProjectPluginConfig from './getRemoteServerProjectPluginConfig';
import setPluginConfig from './setPluginConfig';
import checkBuildArgs from './checkBuildArgs';
import checkStartArgs from './checkStartArgs';
import prepareUserEnv from './prepareUserEnv';
import prepareRuntimeEnv from './prepareRuntimeEnv';
import preparePrerequisiteDir from './preparePrerequisiteDir';

export function getProjectPackageJSONField(fieldName:string){
  let json = getProjectPackageJSON();
  return json[fieldName]
}

//返回packageJson内容
export function getProjectPackageJSON(fieldName?:string){
  if(!_fs.existsSync(_configFiledConstant.CLIConfigFile)){
    return {}
  }
  return  _fs.readJSONSync(_configFiledConstant.CLIConfigFile) //require(_configFiledConstant.CLIConfigFile)
}

//写入package.json文件
export function writeProjectPackageJSON(packageJSON){
  _fs.outputJSONSync(_configFiledConstant.CLIConfigFile, packageJSON)
}

export function setEnviroment(setting){
  _.extend((global as any).__CLI, setting);
}

export function setBuildParams(userInputAgruments){
  _.extend((global as any).__CLI.buildConfig, userInputAgruments);
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
// 仅为全局变量
export function getFullConfig(){
  return (global as any).__CLI
}

export function writePluginConfigToConfigFile(pluginConfig){
  let packageJSON = getProjectPackageJSON()
  packageJSON = setPluginConfig(packageJSON, pluginConfig)
  _fs.outputJSONSync(_configFiledConstant.CLIConfigFile, packageJSON)
}


export {
  generatorDefaultConfig as generatorDefaultConfig,
  getRemoteServerProjectPluginConfig as getRemoteServerProjectPluginConfig,
  setPluginConfig as setPluginConfig,
  checkBuildArgs as checkBuildArgs,
  checkStartArgs as checkStartArgs,
  prepareUserEnv as prepareUserEnv,
  prepareRuntimeEnv as prepareRuntimeEnv,
  preparePrerequisiteDir as preparePrerequisiteDir
}
