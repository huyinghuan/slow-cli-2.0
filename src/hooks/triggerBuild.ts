import * as _hookMap from './map';
import _responseDir from './route/responseDir'
import * as _allDefined from '../all'
import * as _ from 'lodash';
async function initial(){
  let queue = _hookMap.HookQueue["build:initial"] || [];
  let stop = false
  for(let i = 0, length = queue.length; i < length; i++){
    stop = await (queue[i] as any).fn(stop)
  }
  return stop
}

async function handleError(){
  let queue = _hookMap.HookQueue["build:error"] || [];
  let processFactoryList = [];
  _.forEach(queue, (hook)=>{processFactoryList.push(hook.fn)});

  let next = (error)=>{
    let errorProcess = processFactoryList.shift();
    if(!errorProcess){
      return 
    }
    errorProcess(error, next)
  }
}

async function willBuild(buildConfig){
  let queue = _hookMap.HookQueue["build:willBuild"] || [];
  if(!queue.length){
    return
  }
  for(let i = 0, len = queue.length; i < len; i++){
    let hook = queue[i]
    await hook.fn(buildConfig)
  }
}

async function doCompile(buildConfig, data){
  let queue = _hookMap.HookQueue["build:doCompile"] || [];
  if(!queue.length){
    return
  }
  let content = null
  for(let i = 0, len = queue.length; i < len; i++){
    let hook = queue[i]
    content = await hook.fn(buildConfig, data, content)
  }
  return content
}
//didCompile
async function didCompile(buildConfig, data, content){
  let queue = _hookMap.HookQueue["build:didCompile"] || [];
  if(!queue.length){
    return
  }
  for(let i = 0, len = queue.length; i < len; i++){
    let hook = queue[i]
    content = await hook.fn(buildConfig, data, content)
  }
  return content
}

//didCompile
async function doNothing(buildConfig, data){
  let queue = _hookMap.HookQueue["build:doNothing"] || [];
  if(!queue.length){
    return
  }
  for(let i = 0, len = queue.length; i < len; i++){
    let hook = queue[i]
    await hook.fn(buildConfig, data)
  }
}

//didCompile
async function end(buildConfig){
  let queue = _hookMap.HookQueue["build:end"] || [];
  if(!queue.length){
    return
  }
  for(let i = 0, len = queue.length; i < len; i++){
    let hook = queue[i]
    await hook.fn(buildConfig)
  }
}

export default async function(hookType:string, ...options){
  switch(hookType){
    case "willBuild":
      return willBuild.apply(null, options)
    case "initial":
      return initial.apply(null, options)
    case "error":
      return handleError.apply(null, options)
    case "doCompile":
      return doCompile.apply(null, options)
    case "didCompile":
      return didCompile.apply(null, options)
    case "doNothing":
      return doNothing.apply(null, options)
    case "end":
      return end.apply(null,options)
    default:
      throw new Error(`不识别插件类型:${hookType}`)
  }
}