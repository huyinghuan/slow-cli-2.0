import * as _allDefined from '../all';
import * as _ from 'lodash';
import * as _hookMap from './map';

export default function(extName:string, fn){
  extName = extName.split(':')[0];
  if(!_hookMap.HookExtQueue[extName]){
    _hookMap.HookExtQueue[extName] = [];
  }
  //加入hook队列
  _hookMap.HookExtQueue[extName].push(fn)
}

