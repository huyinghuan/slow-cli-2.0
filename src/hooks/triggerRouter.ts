import * as _hookMap from './map';
import * as _async from 'async';
import _responseDir from './route/responseDir'
import * as _allDefined from '../all'

async function forward(req, data){
  let queue = _hookMap.HookQueue["route:forward"] || [];
  if(!queue.length){
    return
  }
  for(let i = 0; i < queue.length; i++){
    await (queue[i] as any).fn(req, data)
  }
  return
}

function didResponse(req){
  let queue = _hookMap.HookQueue["route:didResponse"] || [];
  _async.mapSeries(queue, (hook, next)=>{
    (hook as any).fn(req, next)
  }, ()=>{})
}

async function didRequest(req, data){
  let queue = _hookMap.HookQueue["route:didRequest"] || [];
  if(!queue.length){
    return null
  }
  let content = null;
  for(let i = 0; i < queue.length; i++){
    content = await (queue[i] as any).fn(req, data, content)
  }
  return content
}

function routeInint(router):boolean{
  let queue = _hookMap.HookQueue[_hookMap.route.initial];
  if(!queue){return false}
  for(let i = 0, length = queue.length; i < length; i++){
    if(queue[i].fn(router)){
      return true;
    }
  }
  return false
}
async function willResponse(req, data, responseContent){
  let queue = _hookMap.HookQueue['route:willResponse'] || [];
  for(let i = 0, length = queue.length; i < length; i++){
    responseContent = await (queue[i] as any).fn(req, data, responseContent)
  }
  return responseContent
}

async function noFound(req, resp, cb){
  let queue = _hookMap.HookQueue[_hookMap.route.notFound] || [];
  if(queue.length == 0){
    return false
  }
  return queue[0].fn(req, resp);
}

export default async function(hookType:string, ...options){
  switch(hookType){
    case "forward":
      return forward.apply(null, options)
    case "didResponse":
      didResponse.apply(null, options)
      break
    case "dir":
      return _responseDir.apply(null, options)
    case "didRequest":
      return didRequest.apply(null, options)
    case "initial":
      return routeInint.apply(null, options)
    case "willResponse":
      return willResponse.apply(null, options)
    case "notFound":
      return noFound.apply(null, options)
  }
}