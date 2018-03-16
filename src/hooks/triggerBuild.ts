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

export default async function(hookType:string, ...options){
  switch(hookType){
    case "initial":
      return initial.apply(null, options)
    case "error":
      return handleError.apply(null, options)
  }
}