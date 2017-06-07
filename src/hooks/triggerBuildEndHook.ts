import * as _allDefined from '../all';
import * as _hookMap from './map';
import * as _async from 'async';
export default function(buildConfig, callback: _allDefined.BuildEndCallback){
  let queue = _hookMap.HookQueue[_hookMap.build.endBuild] || [];
  
  _async.mapSeries(queue, (hook, next)=>{
    ;(hook as any).fn(buildConfig, next)
  }, (err)=>{
    callback(err)
  })
}
