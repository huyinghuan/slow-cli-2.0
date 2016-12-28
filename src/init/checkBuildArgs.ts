/**
 *校验build参数 */

import * as _path from 'path';
import * as _init from './index'
import _configFiledConstant from '../config-filed-constant';

function checkOutDir():boolean{
  let workspace = _configFiledConstant.getWorkspace()

  let outdir = _init.getBuildConfig().outdir;
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
  _init.setBuildParams({outdir: outdir, outRelativeDir: outRelativeDir});
  return true
}

export default function(){
  return checkOutDir()
}