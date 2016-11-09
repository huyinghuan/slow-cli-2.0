import * as _allDefined from '../all';
import * as _ from 'lodash';
import * as _hookMap from './map';

export default function(callback: _allDefined.BuildInitCallBack){
  let queue = _hookMap.HookQueue[_hookMap.build.initial] || [];
  let processFactoryList = [];
  _.forEach(queue, (hook)=>{processFactoryList.push(hook.fn)});
  let next = (error, stop)=>{
    if(error){
      return callback(error, stop)
    }
    let processHandle = processFactoryList.shift();
    if(!processHandle){
      return callback(null, stop)
    }
    processHandle(stop, next)
  }
  next(null, false)
}
