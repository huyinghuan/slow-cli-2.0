import _gitHeadHash from 'git-head-hash'
import _configFiledConstant from '../config-filed-constant';

export default function(cb){
  let workspace = _configFiledConstant.getWorkspace()
  let commandStr = `git log -1 --format="%H"`;
  _gitHeadHash(workspace, cb)
}