import * as _allDefined from '../all';
import * as _ from 'lodash';
import * as _hookMap from './map';

import * as _async from 'async';
import _triggerHttpResponseDirHook from './triggerHttpResponseDirHook'
import _triggerHttpNoFoundHook from './triggerHttpNoFoundHook'

function doPrecompile(buildConfig, fileItem, content, finish){
  let queue = _hookMap.HookQueue["precompile:include"] || [];
  var compileContent = ""
  _async.mapSeries(queue, (hook, next)=>{
    (hook as any).fn(buildConfig, content, (error, processContent)=>{
      compileContent = processContent;
      next(error, null)
    })
  }, (error)=>{
    finish(error, compileContent)
  })
}

function insertCompile(buildConfig, fileItem, content, finish){
  let queue = _hookMap.HookQueue["precompile:insert"] || [];
  _async.mapSeries(queue, (hook, next)=>{
    (hook as any).fn(buildConfig, fileItem, content, (error, processContent)=>{
      content = processContent;
      next(error, null)
    })
  }, (error)=>{
    finish(error, content)
  })
}

function replaceCompile(buildConfig, fileItem, content, finish){
  let queue = _hookMap.HookQueue["precompile:replace"] || [];
  _async.mapSeries(queue, (hook, next)=>{
    (hook as any).fn(buildConfig, content, (error, processContent)=>{
      content = processContent;
      next(error, null)
    })
  }, (error)=>{
    finish(error, content)
  })
}

export default function(hookType:string, ...options){
  switch(hookType){
    case "include":
      doPrecompile.apply(null, options)
      break
    case "insert":
      insertCompile.apply(null, options)
      break
    case "replace":
      replaceCompile.apply(null, options)
      break
  }
}