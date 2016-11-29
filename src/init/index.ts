import _configFiledConstant from '../config-filed-constant';
import * as _fs from 'fs-extra';
import * as _path from 'path';
import * as _ from 'lodash';
import generatorDefaultConfig from './generatorDefaultConfig';
import getRemoteServerProjectPluginConfig from './getRemoteServerProjectPluginConfig';
import checkBuildArgs from './checkBuildArgs';
import checkStartArgs from './checkStartArgs';
import prepareUserEnv from './prepareUserEnv';
import prepareRuntimeEnv from './prepareRuntimeEnv';
import preparePrerequisiteDir from './preparePrerequisiteDir';


//设置环境
export function setEnviroment(setting){
  _.extend((global as any).__CLI, setting);
}

export function getEnviroment(){
  return {
    enviroment: (global as any).__CLI.enviroment,
    enviromentDir:  (global as any).__CLI.enviromentDir
  }
}

//设置build参数，用于 命令行指定参数
export function setBuildParams(userInputAgruments){
  _.extend((global as any).__CLI.buildConfig, userInputAgruments);
}

//设置start参数，用户 命令行制定参数
export function setStartParams(userInputAgruments){
  _.extend((global as any).__CLI, userInputAgruments)
}

//获取编译设置
export function getBuildConfig(){
  return (global as any).__CLI.buildConfig
}

// 仅为全局变量
export function getFullConfig(){
  return (global as any).__CLI
}



export {
  generatorDefaultConfig as generatorDefaultConfig,
  getRemoteServerProjectPluginConfig as getRemoteServerProjectPluginConfig,
  checkBuildArgs as checkBuildArgs,
  checkStartArgs as checkStartArgs,
  prepareUserEnv as prepareUserEnv,
  prepareRuntimeEnv as prepareRuntimeEnv,
  preparePrerequisiteDir as preparePrerequisiteDir
}
