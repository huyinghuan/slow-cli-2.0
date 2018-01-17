import * as _allDefined from '../all';
import * as _ from 'lodash';
import * as _hookMap from './map';

import * as _async from 'async';
import _triggerHttpResponseDirHook from './triggerHttpResponseDirHook'
import _triggerHttpNoFoundHook from './triggerHttpNoFoundHook'

function compile(req, data, callback){
  let queue = _hookMap.HookQueue["preview:compile"] || [];

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

function processCompile(req, data, responseContent, callback){
  let queue = _hookMap.HookQueue["preview:processCompile"] || [];
  _async.mapSeries(queue, (hook, next)=>{
    (hook as any).fn(req, data, responseContent, (error, processContent)=>{
      responseContent = processContent;
      next(error, null)
    })
  }, (error)=>{
    callback(error, responseContent)
  })
}

function beforeResponse(req, data, responseContent, callback){
  let queue = _hookMap.HookQueue["preview:beforeResponse"] || [];
  _async.mapSeries(queue, (hook, next)=>{
    (hook as any).fn(req, data, responseContent, (error, processContent)=>{
      responseContent = processContent;
      next(error, null)
    })
  }, (error)=>{
    callback(error, responseContent)
  })
}

export default function(hookType:string, ...options){
  switch(hookType){
    case "notFound":
      _hookMap.route.notFound = "preview:notFound"
      _triggerHttpNoFoundHook.apply(null, options)
      break
    case "dir":
      _hookMap.route.isDir = "preview:dir"
      _triggerHttpResponseDirHook.apply(null, options)
      break
    case "compile":
      compile.apply(null, options)
      break
    case "processCompile":
      processCompile.apply(null, options)
      break
    case "beforeResponse":
      beforeResponse.apply(null, options)

  }
}