import * as _allDefined from '../all';
import * as _ from 'lodash';
import * as _hookMap from './map';

export default function(buildConfig, callback: _allDefined.BuildEndCallback){
  let queue = _hookMap.HookQueue[_hookMap.build.endBuild] || [];
  let processFactoryList = [];
  _.forEach(queue, (hook)=>{processFactoryList.push(hook.fn)});
  
  let next = (error, data)=>{
    if(error){
      return callback(error, data)
    }
    let processHandle = processFactoryList.shift();
    if(!processHandle){
      return callback(null, data)
    }
    processHandle(buildConfig, data, next)
  }
  
  next(null, {})
}
