/**定义http response 即将响应完之后的hook */
import * as _hookMap from './map';
import { route } from './map';
import * as _async from 'async';
/**
 * route:didResponse
 */
export default function(req){
  let queue = _hookMap.HookQueue[_hookMap.route.didResponse] || [];
  _async.mapSeries(queue, (hook, next)=>{
    (hook as any).fn(req, next)
  }, ()=>{})
}
