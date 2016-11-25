import _configFiledConstant from '../config-filed-constant';
import * as _init from './index';
import * as _path from 'path';
export default function(value){
  value = value || 'development';
  _init.setEnviroment({
    enviroment: value,
    enviromentDir: _path.join(_configFiledConstant.environmentRootDir, value)
  })
}