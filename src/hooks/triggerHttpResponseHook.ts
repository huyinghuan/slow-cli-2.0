/**定义http response 即将响应之前的hook */
import * as _allDefined from '../all';
import * as _ from 'lodash';
import * as _hookMap from './map';
import { route } from './map';

export default function(req, data, responseContent, callback: _allDefined.WillResponseCallBack){
  let queue = _hookMap.HookQueue[_hookMap.route.willResponse];
  let contentFactoryList = [];
  _.forEach(queue, (hook)=>{contentFactoryList.push(hook.fn)});
  
  let next = (error, responseContent)=>{
    if(error){
      return callback(error, responseContent)
    }
    let contentProcess = contentFactoryList.shift();
    if(!contentProcess){
      return callback(error, responseContent)
    }
    contentProcess(req, data, responseContent, next)
  }
  
  next(null, responseContent)
}
