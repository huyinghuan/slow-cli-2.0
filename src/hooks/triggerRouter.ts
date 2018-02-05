import * as _hookMap from './map';
import * as _async from 'async';

function forward(req, data, callback){
  let queue = _hookMap.HookQueue["route:forward"] || [];
  if(!queue.length){
    callback(null)
    return
  }
  _async.mapSeries(queue, (hook, next)=>{
    (hook as any).fn(req, data, (error)=>{ next(error)})
  }, (error)=>{
    callback(error)
  })
}

export default function(hookType:string, ...options){
  switch(hookType){
    case "forward":
      forward.apply(null, options)
      break
  }
}