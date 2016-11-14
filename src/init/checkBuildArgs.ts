/**
 *校验build参数 */

import * as _path from 'path';
import * as _init from './index'

function checkOutDir():boolean{
  let outdir = _init.getBuildConfig().outdir;

  if(!outdir){return false}

  if(!_path.isAbsolute(outdir)){
    outdir = _path.join(process.cwd(), outdir)
  }

  if(process.cwd() == outdir){
    console.log("编译目录不能和项目跟目录为同一个")
    return false
  }
  _init.setBuildParams({ourdir: outdir});
  return true
}

export default function(){
  return checkOutDir()
}