import _config from '../file-config';
import * as _fs from 'fs-extra';
import * as _path from 'path';

const _globalConfig = {
  port: 14422,
  index: 'index.html',
  pluginConfig: {}
}


//准备plugin环境
export function prepareBaseEnv(){
  
}

/**
 * 准备用户环境，配置等
 */
export function prepareUserEnv(){

  if(!_fs.existsSync(_config.CLIConfigFile)){
    console.log(`非 ${_config.infinity} 项目， 仅启用静态服务器功能`);

  }

  //读取项目目录下的package.json
  //读取package.json下用户自定义配置
  let packageJSON = require(_config.CLIConfigFile);
  (global as any).__CLI = packageJSON[_config.infinity];
}
