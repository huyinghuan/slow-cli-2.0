/**定义http response 即将响应之前的hook */
import * as _allDefined from '../all';
import * as _hookMap from './map';
import { route } from './map';

import * as _async from 'async';
/**
 * route:willResponse
 */
export default function(req, data, responseContent, callback: _allDefined.WillResponseCallBack){
  let queue = _hookMap.HookQueue[_hookMap.route.willResponse] || [];
  _async.mapSeries(queue, (hook, next)=>{
    (hook as any).fn(req, data, responseContent, (error, processContent)=>{
      responseContent = processContent;
      next(error, null)
    })
  }, (error)=>{
    callback(error, responseContent)
  })
}
