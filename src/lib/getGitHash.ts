import * as _fs from 'fs';
import * as _path from 'path';
import {exec as _exec} from 'child_process'
import _configFiledConstant from '../config-filed-constant';

export default function(cb){
  let workspace = _configFiledConstant.getWorkspace()
  let commandStr = `git log -1 --format="%H"`;
  if(!_fs.existsSync(_path.join(workspace, ".git"))){
    return cb(null, null)
  }
  _exec(commandStr, {cwd: workspace}, (error, stdout, stderr)=>{
    if(error){
      return cb(error)
    }
    stdout = stdout.replace(/^(\s)+/, "").replace(/(\s)+$/, "");
    //去空格
    stdout = stdout.replace(/^\s*/, "").replace(/\s*$/, "")
    //如果还有空格
    if(/\s/.test(stdout)){
      return cb(null, null)
    }
    cb(null, stdout)
  })
}