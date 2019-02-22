import * as _allDefined from '../all';
import * as _ from 'lodash';
import * as _hookMap from './map';

import * as _async from 'async';
import _triggerHttpResponseDirHook from './triggerHttpResponseDirHook'
import _triggerHttpNoFoundHook from './triggerHttpNoFoundHook'

async function compile(req, data, callback){
  let queue = _hookMap.HookQueue["preview:compile"] || [];
  if(!queue.length){
    return
  }
  let content = null;
  for(let i = 0; i < queue.length; i++){
    content = await (queue[i] as any).fn(req, data, content)
  }
  return content
}

async function beforeResponse(req, data, responseContent, callback){
  let queue = _hookMap.HookQueue["preview:beforeResponse"] || [];
  for(let i = 0; i < queue.length; i++){
    responseContent = await (queue[i] as any).fn(req, data, responseContent)
  }
  return responseContent
}

async function forward(req, data){
  let queue = _hookMap.HookQueue["preview:forward"] || [];
  if(!queue.length){
    return
  }
  for(let i = 0; i < queue.length; i++){
    await (queue[i] as any).fn(req, data)
  }
}

async function projectUpdate(){
  let queue = _hookMap.HookQueue["preview:project:update"] || [];
  if(!queue.length){
    return
  }
  for(let i = 0; i < queue.length; i++){
    await (queue[i] as any).fn()
  }
}

export default async function(hookType:string, ...options){
  switch(hookType){
    case "forward":
      return forward.apply(null, options)
    case "compile":
      return compile.apply(null, options)
    case "beforeResponse":
      return beforeResponse.apply(null, options)
    case "project:update":
      return projectUpdate()
  }
}