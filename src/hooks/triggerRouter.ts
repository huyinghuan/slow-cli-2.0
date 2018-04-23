import * as _hookMap from './map';
import * as _async from 'async';

async function forward(req, data){
  let queue = _hookMap.HookQueue["route:forward"] || [];
  if(!queue.length){
    return
  }
  let content = null;
  for(let i = 0; i < queue.length; i++){
    await (queue[i] as any).fn(req, data)
  }
}

export default async function(hookType:string, ...options){
  switch(hookType){
    case "forward":
      return forward.apply(null, options)
  }
}