import * as _allDefined from '../all';
import * as _ from 'lodash';
import * as _hookMap from './map';
import * as _async from 'async';

export default function(buildConfig, callback: _allDefined.BuildWillDoCallBack){
  let queue = _hookMap.HookQueue[_hookMap.build.willBuild] || [];
  if(!queue.length){
    callback(null, buildConfig)
    return
  }
  _async.mapSeries(queue, (hook, next)=>{
    (hook as any).fn(buildConfig, (error)=>{
      next(error, null)
    })
  }, (error)=>{
    callback(error, buildConfig)
  })
}
