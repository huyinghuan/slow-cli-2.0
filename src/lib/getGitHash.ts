import * as _gitHeadHash from 'git-head-hash'
import _configFiledConstant from '../config-filed-constant';
import * as _path from 'path'
import * as _fs from 'fs'
export default function(cb){
  let workspace = _configFiledConstant.getWorkspace()
  let gitPath = _path.join(workspace, ".git")
  if(_fs.existsSync(gitPath)){
    _gitHeadHash(workspace, cb)
  }else{
    cb(null, "NOT-GIT-PROJECT")
  }
}