import * as _path from 'path';
import * as _fs from 'fs-extra';

import * as _hook from '../hooks/index';
import * as _plugin from '../plugin/index';
import _getGitHash from '../lib/getGitHash';
import _log from '../lib/log';
import _executeProjectCompile from './executeProjectCompile';
import _configFiledConstant from '../config-filed-constant';
/**
 * 用于一次性编译
 * 编译完成后即推出进程
 * */
export default async function(needLoadPlugin?){
  //加载插件
  /* istanbul ignore if */
  if(needLoadPlugin != false){
    _plugin.scanPlugins('build')
  }
  let __starTime = Date.now();
  let queue = [];
  try{
    let gitHash =  _getGitHash();  
    let stop = await _hook.triggerBuild("initial")
    if(stop){
      return
    }
    _executeProjectCompile(_configFiledConstant.getBuildConfig({gitHash:gitHash}), (error)=>{
      //编译成功
      if(!error){
        console.log("build success".green)
        console.log(`编译用时: ${Date.now() - __starTime}ms`)
      }else{
        _log.error(error);
        _log.error("build fail".red);
        _hook.triggerBuildErrorHook(error);
      }
    })
  }catch(e){
    _log.error(e);
    _log.fail('build 初始化失败');
    _hook.triggerBuildErrorHook(e);
  }
  
}