
import _configFieldConstant from '../config-filed-constant';
import * as _fs from 'fs-extra';
import * as _path from 'path';
const pluginRootDir = _configFieldConstant.pluginDir;

//获取实际已安装插件的版本好 （node_modules/xx）
export default function(pluginName){
  if(!_fs.existsSync(_path.join(pluginRootDir, pluginName))){
    return -1
  }
  let packageJson = _fs.readJSONSync(_path.join(pluginRootDir, pluginName, 'package.json'))
  return packageJson['version'] || -1
}