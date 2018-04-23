import * as _async from 'async';
import * as _fs from 'fs-extra';

import _getAllFileInProject from '../lib/getAllFileInProject';
import * as _hook from '../hooks/index';
import _compileFileQueue from './compileFileQueue';
import _compileFile from './compileFile';
import _log from '../lib/log';
import * as _ from 'lodash'
import _configFiledConstant from '../config-filed-constant';
/**
 * @params: buildConfig <Object> 编译参数
*/
export default async function(buildConfig){
  let queue = [];
  
  //额外需要编译的文件
  buildConfig.__extra = [];
  //编译完成后需要删除掉冗余文件
  buildConfig.__del = [];
  //将要编译了
  _hook.triggerBuild("willBuild", buildConfig)
  
  //处理文件队列 （doCompile，didCompile，doNothing) in there
  queue.push((buildConfig, next)=>{
    _configFiledConstant.setBuildParams(buildConfig)
    //获取所有待编译文件
    let fileQueue:Array<Object> = _getAllFileInProject(false);
    //编译文件
    _compileFileQueue(buildConfig, fileQueue, next)
  })
  /**/
  //处理额外的文件， 比如html中提取出来的js src， css link等文件合并
  queue.push((buildConfig, next)=>{
    _async.map(buildConfig.__extra, (fileData, cb)=>{
      _compileFile(buildConfig, fileData, cb)
    }, (error)=>{
      next(error, buildConfig)
    })
  })

  //删除标记文件
  queue.push((buildConfig, next)=>{
    buildConfig.__del.forEach((filepath)=>{
      _fs.removeSync(filepath);
      _log.info(`remove ${filepath}`)
    })
    next(null, buildConfig)
  })

  queue.push((buildConfig, next)=>{
    _hook.triggerBuildEndHook(buildConfig, next)
  })

  _async.waterfall(queue, (error)=>{
    finish(error)
  })
}