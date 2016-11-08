import * as _allDefined from '../all';
import * as _ from 'lodash';
import * as _hookMap from './map';

export default function(callback: _allDefined.CompilerCallBack){
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
    compiler(data, responseContent, next)
  }
  next(null, {}, null)
}