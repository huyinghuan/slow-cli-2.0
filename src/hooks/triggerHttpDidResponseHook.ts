/**定义http response 即将响应完之后的hook */
import * as _hookMap from './map';
import { route } from './map';
import * as _ from 'lodash';
/**
 * route:didResponse
 */
export default function(req){
  let queue = _hookMap.HookQueue[_hookMap.route.didResponse] || [];
  let contentFactoryList = [];
  _.forEach(queue, (hook)=>{contentFactoryList.push(hook.fn)});
  
  let next = ()=>{
    let contentProcess = contentFactoryList.shift();
    if(!contentProcess){
      return;
    }
    contentProcess(req, next)
  }
  
  next()
}
