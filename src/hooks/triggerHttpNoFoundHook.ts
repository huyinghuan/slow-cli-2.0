import * as _hookMap from './map'
/**
 * route:noFound
 */
export default function(req, resp, cb){
  let queue = _hookMap.HookQueue[_hookMap.route.notFound] || [];
  if(queue.length == 0){
    return cb(false)
  }
  queue[0].fn(req, resp, cb);
}