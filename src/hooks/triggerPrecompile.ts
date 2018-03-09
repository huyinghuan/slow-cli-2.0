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

export default function(hookType:string, ...options){
  switch(hookType){
    case "include":
      doPrecompile.apply(null, options)
      break
  }
}