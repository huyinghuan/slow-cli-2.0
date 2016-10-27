
import _config from './config';
import * as _fs from 'fs-extra';
import * as _path from 'path';
import * as _colors from 'colors';
import * as _hooks from './hooks/index';

//准备plugin环境
export function prepareBaseEnv(){
  //确保根目录存在
  _fs.ensureDirSync(_config.cliRootDir)
  //确保package.json存在 //输出默认配置到  ~/.xxx/packageJSON
  if(!_fs.existsSync(_config.plguinPackageJSON)){
    _fs.outputJSONSync(_config.plguinPackageJSON, _config.pluginInfo)
  }
}

/**
 * 准备用户环境，配置等
 */
export function prepareUserEnv(){
  //读取项目目录下的package.json
  //读取package.json下用户自定义配置
  let packageJSON = require(_path.join(process.cwd(), 'package.json'));
  (global as any).__CLI = packageJSON[_config.infinity];
}

/**
 * 加载插件
 */
export  function loadPlugins(cb){_hooks.scanPlugins(cb)}

