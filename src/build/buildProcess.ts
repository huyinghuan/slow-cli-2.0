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
  let gitHash =  _getGitHash();  
  let stop = await _hook.triggerBuild("initial")
  if(stop){
    return
  }
  await _executeProjectCompile(_configFiledConstant.getBuildConfig({gitHash:gitHash}))
  console.log("build success".green)
  console.log(`编译用时: ${Date.now() - __starTime}ms`)
}