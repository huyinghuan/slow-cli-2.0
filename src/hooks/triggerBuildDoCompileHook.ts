import * as _allDefined from '../all';
import * as _ from 'lodash';
import * as _hookMap from './map';
import * as _async from 'async';

export default function(buildConfig, data, callback: _allDefined.BuildDoCompileCallback){
  let queue = _hookMap.HookQueue[_hookMap.build.doCompile] || [];

  let content = null;
  _async.mapSeries(queue, (hook, next)=>{
    (hook as any).fn(buildConfig, data, content, (error, processContent)=>{
      content = processContent;
      next(error, null)
    })
  }, (error)=>{
    callback(error, content)
  })
}
