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
}

function didResponse(req){
  let queue = _hookMap.HookQueue["route:didResponse"] || [];
  _async.mapSeries(queue, (hook, next)=>{
    (hook as any).fn(req, next)
  }, ()=>{})
}

function didRequest(req, data, callback: _allDefined.CompilerCallBack){
  let queue = _hookMap.HookQueue["route:didRequest"] || [];
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
function willResponse(req, data, responseContent, callback: _allDefined.WillResponseCallBack){
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
      didRequest.apply(null, options)
      break
    case "initial":
      return routeInint.apply(null, options)
    case "willResponse":
      willResponse.apply(null, options)
      break
    case "notFound":
      return noFound.apply(null, options)
  }
}