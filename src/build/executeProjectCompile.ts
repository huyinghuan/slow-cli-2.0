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
  //额外需要编译的文件
  buildConfig.__extra = [];
  //编译完成后需要删除掉冗余文件
  buildConfig.__del = [];
  //将要编译了
  await _hook.triggerBuild("willBuild", buildConfig)
  
  //处理文件队列 （doCompile，didCompile，doNothing) in there
  _configFiledConstant.setBuildParams(buildConfig)
  //获取所有待编译文件
  let fileQueue:Array<Object> = _getAllFileInProject(false);

  //编译文件
  await _compileFileQueue(buildConfig, fileQueue)

  /**/
  //处理额外的文件， 比如html中提取出来的js src， css link等文件合并
  let queue = buildConfig.__extra.map((fileData)=>{return _compileFile(buildConfig, fileData)})
  await Promise.all(queue)

  //删除标记文件
  buildConfig.__del.forEach((filepath)=>{
    _fs.removeSync(filepath);
    _log.info(`remove ${filepath}`)
  })
  await _hook.triggerBuild('end', buildConfig)
}