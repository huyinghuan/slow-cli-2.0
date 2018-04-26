import * as _fs from 'fs-extra';
import * as _async from 'async';
import * as _hook from '../hooks/index';
import _log from '../lib/log';
/**
 * 编译单个文件
 * 触发发各类hook，doCompile, didCompile*/
export default async function(buildConfig, data){
  let queue = [];
  let content = await _hook.triggerBuild('doCompile', buildConfig, data)
  //内容加工
  content = await _hook.triggerBuild('didCompile', buildConfig, data, content)
  /**
   * 已经编译完成，写入文件。
   * 如果没有任何内容，则跳过, 如果ignore为true也跳过
  */
  if(!content || data.ignore){
    return
  }
  let outputFilePathArr = [].concat(data.outputFilePath);
  let appendFile = data.appendFile;

  outputFilePathArr.forEach((outputFilePath)=>{
    if(!appendFile){
      return _fs.outputFileSync(outputFilePath, content)
    }
    _log.info(`append ${data.inputFileRelativePath} to ${outputFilePath.replace(data.outdir, "")}`)
    if(!_fs.existsSync(outputFilePath)){
      return _fs.outputFileSync(outputFilePath, content)
    }
    if(data.appendFilePrefix){
      content = data.appendFilePrefix + content
    }
    _fs.appendFileSync(outputFilePath, content, {encoding: 'utf8'})
  })

  /* 未完成编译， 触发hook， hook如果已经写入文件，那么不做任何事情， 如果ignore为true也不做任何事情
   如果没有写入文件， 那么默认copy[调用默认hook(plugin/default-plugin/build/*)]文件。*/
   await _hook.triggerBuild('doNothing', buildConfig, data)
   if(!data.hasProcess){
     _log.info(`忽略文件: ${data.inputFilePath}`);
   }  
}