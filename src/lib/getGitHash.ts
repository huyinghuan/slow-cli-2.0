import * as _fs from 'fs';
import * as _path from 'path';
import {exec as _exec} from 'child_process'

export default function(cb){
  let commandStr = `git log -1 --format="%H"`;
  if(!_fs.existsSync(_path.join(process.cwd(), ".git"))){
    return cb(null, null)
  }
  _exec(commandStr, {cwd: process.cwd()}, (error, stdout, stderr)=>{
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