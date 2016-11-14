import * as _allDefined from '../all';
import * as _ from 'lodash';
import * as _hookMap from './map';

export default function(error){
  let queue = _hookMap.HookQueue[_hookMap.build.error] || [];
  let processFactoryList = [];
  _.forEach(queue, (hook)=>{processFactoryList.push(hook.fn)});

  let next = (error)=>{
    let errorProcess = processFactoryList.shift();
    if(!errorProcess){
      return 
    }
    errorProcess(error, next)
  }

  next(error)
}