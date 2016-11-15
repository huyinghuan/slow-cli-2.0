import * as _allDefined from '../all';
import * as _ from 'lodash';
import * as _hookMap from './map';

export default function(data, callback: _allDefined.BuildDoNothingCallback){
  let queue = _hookMap.HookQueue[_hookMap.build.doNothing] || [];
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

    processHandle(data, next)
  }
  
  next(null, data)
}
