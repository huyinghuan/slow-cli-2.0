import * as _allDefined from '../all';
import * as _ from 'lodash';
import * as _hookMap from './map';

export default function(route){
  let queue = _hookMap.HookQueue[_hookMap.build.serverFilter] || [];
  let processFactoryList = [];
  if(!queue){return false}
  for(let i = 0, length = queue.length; i < length; i++){
    queue[i].fn(route)
  }
}
