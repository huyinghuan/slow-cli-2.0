import * as _allDefined from '../all';
import * as _hookMap from './map';
import * as _async from 'async';

export default function(buildConfig, data, callback: _allDefined.BuildDoNothingCallback){
  let queue = _hookMap.HookQueue[_hookMap.build.doNothing] || [];

  _async.mapSeries(queue, (hook, next)=>{
    (hook as any).fn(buildConfig, data, (err)=>{next(err,null)})
  }, (err)=>{
    callback(err, data)
  })
}
