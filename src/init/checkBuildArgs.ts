/**
 *校验build参数 */

import * as _path from 'path';
import _configFiledConstant from '../config-filed-constant';

export default function(){
  let workspace = _configFiledConstant.getWorkspace()
  let outdir = _configFiledConstant.getBuildConfig('outdir');
  let outRelativeDir = outdir;
  if(!outdir){
    throw new Error('编译输出目录不存在')
  }
  if(!_path.isAbsolute(outdir)){
    outRelativeDir = outdir
    outdir = _path.join(workspace, outdir)
  }
  if(workspace == outdir){
    throw new Error("编译输出目录不能和项目跟目录为同一个")
    
  }
  _configFiledConstant.setBuildParams({outdir: outdir, outRelativeDir: outRelativeDir});
}