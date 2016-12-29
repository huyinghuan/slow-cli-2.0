import _configFiledConstant from '../config-filed-constant';
import * as _path from 'path';
export default function(value){
  value = value || 'develop';
  _configFiledConstant.setGlobal({
    enviroment: value,
    enviromentDir: _path.join(_configFiledConstant.get().environmentRootDir, value)
  })
}