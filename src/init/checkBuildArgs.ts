/**
 *校验build参数 */

import * as _path from 'path';
import _configFiledConstant from '../config-filed-constant';

export default function():boolean{
  let workspace = _configFiledConstant.getWorkspace()
  let outdir = _configFiledConstant.getBuildConfig('outdir');
  let outRelativeDir = outdir;
  if(!outdir){return false}
  if(!_path.isAbsolute(outdir)){
    outRelativeDir = outdir
    outdir = _path.join(workspace, outdir)
  }

  if(workspace == outdir){
    console.log("编译目录不能和项目跟目录为同一个")
    return false
  }
  _configFiledConstant.setBuildParams({outdir: outdir, outRelativeDir: outRelativeDir});
  return true
}