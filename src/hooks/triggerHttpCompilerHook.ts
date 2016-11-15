import * as _allDefined from '../all';
import * as _ from 'lodash';
import * as _hookMap from './map';

/**
 * route:didRequest
 */
export default function(req, data, callback: _allDefined.CompilerCallBack){
  let queue = _hookMap.HookQueue[_hookMap.route.didRequest] || [];
  let contentFactoryList = [];
  _.forEach(queue, (hook)=>{contentFactoryList.push(hook.fn)});
  let next = (error, data, responseContent)=>{
    if(error){
      return callback(error, data, responseContent)
    }
    let compiler = contentFactoryList.shift();
    if(!compiler){
      return callback(null, data, responseContent)
    }
    compiler(req, data, responseContent, next)
  }
  next(null, data, null)
}
