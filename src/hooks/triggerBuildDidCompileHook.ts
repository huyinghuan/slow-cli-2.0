import * as _allDefined from '../all';
import * as _ from 'lodash';
import * as _hookMap from './map';

export default function(buildConfig, data, content, callback: _allDefined.BuildDoCompileCallback){
  let queue = _hookMap.HookQueue[_hookMap.build.didCompile] || [];
  let processFactoryList = [];
  _.forEach(queue, (hook)=>{processFactoryList.push(hook.fn)});
  let next = (error, content)=>{
    if(error){
      return callback(error, content)
    }
    let processHandle = processFactoryList.shift();
    if(!processHandle){
      return callback(null, content)
    }
    processHandle(buildConfig, data, content, next);
  }
  next(null, content)
}
