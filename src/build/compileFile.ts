import * as _fs from 'fs-extra';
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
  // 如果ignore为true跳过
  if(data.ignore){
    return
  }
  //如果没有任何内容，则执行copy
  if(!content){
    /* 默认copy[调用默认hook(plugin/default-plugin/build/*)]文件。*/
    await _hook.triggerBuild('doNothing', buildConfig, data)
    if(!data.hasProcess){
      _log.info(`忽略文件: ${data.inputFilePath}`);
    } 
    return
  }
   /**
   * 已经编译完成，写入文件。
  */
  let outputFilePathArr = [].concat(data.outputFilePath);
  let appendFile = data.appendFile;

  outputFilePathArr.forEach((outputFilePath)=>{
    if(!appendFile){
      _fs.outputFileSync(outputFilePath, content)
      return
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

   
}