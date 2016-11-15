import * as _allDefined from '../all';
import * as _ from 'lodash';
import * as _hookMap from './map';

export default function(buildConfig, callback: _allDefined.BuildWillDoCallBack){
  let queue = _hookMap.HookQueue[_hookMap.build.willBuild] || [];
  
  let processFactoryList = [];
  _.forEach(queue, (hook)=>{processFactoryList.push(hook.fn)});
  let next = (error, buildConfig)=>{
    if(error){
      return callback(error, buildConfig)
    }
    let processHandle = processFactoryList.shift();
    if(!processHandle){
      return callback(null, buildConfig)
    }
    processHandle(buildConfig, next)
  }
  next(null, buildConfig)
}
