import * as _allDefined from '../all';
import * as _ from 'lodash';
import * as _hookMap from './map';

export default function(buildConfig, data, callback: _allDefined.BuildDoCompileCallback){
  let queue = _hookMap.HookQueue[_hookMap.build.doCompile] || [];
  let processFactoryList = [];
  _.forEach(queue, (hook)=>{processFactoryList.push(hook.fn)});

  let next = (error, content)=>{
    if(error){
      return callback(error, content)
    }
    if(content){
    //  console.log(content, 999)
    }
    let processHandle = processFactoryList.shift();
    if(!processHandle){
      return callback(null, content)
    }
    processHandle(buildConfig, data, content, next)
  }
  
  next(null, null)
}
