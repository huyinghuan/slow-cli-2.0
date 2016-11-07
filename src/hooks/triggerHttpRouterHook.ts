import * as _hookMap from './map';
import * as _express from 'express';
/**
*触发RouterHook, 可用于自定义路由操作
* 返回 true 停止其他hook，
* 返回 false 使用其他hook
*/
export default function(router:_express.Router):boolean{
  let queue = _hookMap.HookQueue[_hookMap.route.initial];
  if(!queue){return false}
  for(let i = 0, length = queue.length; i < length; i++){
    if(queue[i].fn(router)){
      return true;
    }
  }
  return false
}