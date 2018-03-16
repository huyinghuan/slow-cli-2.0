import * as _allDefined from '../all';
import * as _ from 'lodash';
import * as _hookMap from './map';

import * as _async from 'async';

async function doPrecompile(buildConfig, fileItem, content){
  let queue = _hookMap.HookQueue["precompile:include"] || [];
  for(let i = 0, length = queue.length; i < length; i++){
    content = await (queue[i] as any).fn(buildConfig, content)
  }
  return content
}

async function insertCompile(buildConfig, fileItem, content){
  let queue = _hookMap.HookQueue["precompile:insert"] || [];
  for(let i = 0, length = queue.length; i < length; i++){
    content = await (queue[i] as any).fn(buildConfig, fileItem, content)
  }
  return content
}

async function replaceCompile(buildConfig, fileItem, content){
  let queue = _hookMap.HookQueue["precompile:replace"] || [];
  for(let i = 0, length = queue.length; i < length; i++){
    content = await (queue[i] as any).fn(buildConfig, content)
  }
  return content
}

export default async function(hookType:string, ...options){
  switch(hookType){
    case "include":
      return doPrecompile.apply(null, options)
    case "insert":
      return insertCompile.apply(null, options)
    case "replace":
      return replaceCompile.apply(null, options)
  }
}