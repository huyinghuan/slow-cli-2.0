import _configFiledConstant from '../config-filed-constant';
import _getGitHash from '../lib/getGitHash';
import _excuteFileCompile from './excuteFileCompile'
import * as _async from 'async';

import * as _hook from '../hooks/index';
import * as _plugin from '../plugin/index';
import _log from '../lib/log';

export default function(prepareFn, filepath, finish){
    prepareFn();
     //加载插件
    _plugin.scanPlugins('build');
    
    let queue = [];
    queue.push((next)=>{
        _hook.triggerBuildInitHook((error, stop)=>{next(error)})
    })
    queue.push((next)=>{
      _getGitHash(next)
    })
    queue.push((gitHash, next)=>{
      let buildConfig = _configFiledConstant.getBuildConfig({
        gitHash:gitHash,
        __extra: [],//额外需要编译的文件
        __del: [] //编译完成后需要删除掉冗余文件
      });
      _excuteFileCompile(buildConfig, filepath, next)
    })
    _async.waterfall(queue,finish)
}