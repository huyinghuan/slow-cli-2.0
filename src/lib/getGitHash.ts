import _gitHeadHash from 'git-head-hash'
import _configFiledConstant from '../config-filed-constant';

export default function(cb){
  let workspace = _configFiledConstant.getWorkspace()
  _gitHeadHash(workspace, cb)
}