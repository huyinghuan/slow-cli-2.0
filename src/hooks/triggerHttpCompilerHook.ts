import * as _allDefined from '../all';
import * as _ from 'lodash';
import * as _hookMap from './map';

import * as _async from 'async';
/**
 * route:didRequest
 */
export default function(req, data, callback: _allDefined.CompilerCallBack){
  let queue = _hookMap.HookQueue[_hookMap.route.didRequest] || [];

  if(!queue.length){
    callback(null, null)
    return
  }
  let content = null;
  _async.mapSeries(queue, (hook, next)=>{
    (hook as any).fn(req, data, content, (error, compileContent)=>{
      content = compileContent;
      next(error, null)
    })
  }, (error)=>{
    callback(error, content)
  })
}
