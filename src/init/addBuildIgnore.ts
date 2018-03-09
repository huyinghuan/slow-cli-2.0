import _configFiledConstant from '../config-filed-constant';
import * as _ from 'lodash'

export default function(ignore:any){
  let  ignoreList = _configFiledConstant.getBuildConfig('ignore')
  ignoreList = _.union(ignoreList, [].concat(ignore));
  _configFiledConstant.setBuildParams({ignore: ignoreList})
}