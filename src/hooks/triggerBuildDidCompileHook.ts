import * as _allDefined from '../all';
import * as _ from 'lodash';
import * as _hookMap from './map';

export default function(data, content, callback: _allDefined.BuildDoCompileCallback){
  let queue = _hookMap.HookQueue[_hookMap.build.didCompile] || [];
  let processFactoryList = [];
  _.forEach(queue, (hook)=>{processFactoryList.push(hook.fn)});
  let next = (error, data, content)=>{
    if(error){
      return callback(error, data, content)
    }
    let processHandle = processFactoryList.shift();
    if(!processHandle){
      return callback(null, data, content)
    }
    processHandle(data, content, next);
  }
  
  next(null, data, content)
}
