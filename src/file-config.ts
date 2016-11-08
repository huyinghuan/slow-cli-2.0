import * as _os from 'os';
import * as _path from 'path';

/**
 * 仅用于记录文件位置
 */
 
//工具名称
const _infinity = 'silky';

//根目录
const _root = process.cwd();

const config = {
  infinity: _infinity,
  pluginConfigField: `${_infinity}-plugin`,
  pluginVersionField: `${_infinity}-version`,
  pluginDir: _path.join(_root, 'node_modules'), //插件目录
  CLIConfigFile: _path.join(_root, 'package.json'), //插件配置文件
  buildField: `${_infinity}-build` //build 相关配置
}

export default config;