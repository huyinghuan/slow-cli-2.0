import * as _allDefined from '../all';
import * as _async from 'async';
import * as _hookMap from './map';

export default function(callback: _allDefined.BuildInitCallBack){
  let queue = _hookMap.HookQueue[_hookMap.build.initial] || [];
  let isStop = false
  _async.mapSeries(queue, (hook, next)=>{
    (hook as any).fn(isStop, (error, flag)=>{
      isStop = flag
      next(error, null)
    })
  }, (error)=>{
    callback(error, isStop)
  })
}
