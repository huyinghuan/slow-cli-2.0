import _configFiledConstant from '../config-filed-constant';
import * as _fs from 'fs-extra';
import * as _path from 'path'
export default function(){
  _configFiledConstant.prerequisiteEnvironment.forEach((prerequisite)=>{
    _fs.mkdirpSync(_path.join(_configFiledConstant.environmentRootDir, prerequisite))
  })
}