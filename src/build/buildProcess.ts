import * as _path from 'path';
import * as _fs from 'fs-extra';
import * as _async from 'async'

import * as _hook from '../hooks/index';
import * as _plugin from '../plugin/index';
import _getGitHash from '../lib/getGithash';
import _log from '../lib/log';
import _executeProjectCompile from './executeProjectCompile';
import * as _init from '../init/index';
/**
 * 用于一次性编译
 * 编译完成后即推出进程
 * */
export default function(finish){
  let __starTime = Date.now();
  //加载插件
  _plugin.scanPlugins('build')

  let queue = [];
  let gitHash = null;
  //build初始化HOOK
  queue.push((cb)=>{_hook.triggerBuildInitHook(cb);});
  queue.push((stop, cb)=>{
    _getGitHash((error, hash)=>{
      gitHash = hash
      cb(error, stop)
    })
  })
  _async.waterfall(queue, (error, stop)=>{
    if(error){
      _log.error(error);
      _log.fail('build 初始化失败'.red);
      _hook.triggerBuildErrorHook(error);
      return;
    }
    if(stop){return}
    _executeProjectCompile(_init.getBuildConfig({gitHash:gitHash}), (error)=>{
      //编译成功
      if(!error){
        console.log("build success".green)
        console.log(`编译用时: ${Date.now() - __starTime}ms`)
      }else{
        _log.error(error);
        _log.error("build fail".red);
        _hook.triggerBuildErrorHook(error);
      }
      finish(error)
    })
  })
}