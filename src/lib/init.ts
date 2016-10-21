
import _config from './config';
import * as _fs from 'fs-extra';


export function prepareBaseEnv(){
  //确保根目录存在
  _fs.ensureDirSync(_config.cliRootDir)
  //确保package.json存在 //写出默认信息
  if(!_fs.existsSync(_config.plguinPackageJSON)){
    _fs.outputJSONSync(_config.plguinPackageJSON, _config.pluginInfo)
  }
}

/**
 * 准备用户环境，配置等
 */
export function prepareUserEnv(){}

/**
 * 加载插件
 */
export function loadPlugins(){

}

