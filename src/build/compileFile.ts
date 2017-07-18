import * as _fs from 'fs-extra';
import * as _async from 'async';
import * as _hook from '../hooks/index';
import _log from '../lib/log';
/**
 * 编译单个文件
 * 触发发各类hook，doCompile, didCompile*/
export default function(buildConfig, data, next){
  let queue = [];

  //编译工具编译
  queue.push((cb)=>{
    _hook.triggerBuildDoCompileHook(buildConfig, data, cb)
  })

  //内容加工
  queue.push((content, cb)=>{
    _hook.triggerBuildDidCompileHook(buildConfig, data, content, cb)
  })

  /**
   * 已经编译完成，写入文件。
   * 如果没有任何内容，则跳过, 如果ignore为true也跳过
  */
  queue.push((content, cb)=>{
    if(!content || data.ignore){
      return cb(null, false)
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
    cb(null, true)
  })

  /* 未完成编译， 触发hook， hook如果已经写入文件，那么不做任何事情， 如果ignore为true也不做任何事情
   如果没有写入文件， 那么默认copy[调用默认hook(plugin/default-plugin/build/*)]文件。*/
  queue.push((didWrite, cb)=>{
    if(didWrite || data.ignore){return cb(null)}
    _hook.triggerBuildDoNothingHook(buildConfig, data, (error)=>{
      if(error){return cb(error)}

      if(data.hasProcess){
        return cb(null)
      }
      _log.info(`忽略文件: ${data.inputFilePath}`);
      cb(null)
    })
  })

  _async.waterfall(queue, (error)=>{
    if(error){
      console.log(error)
      console.log(`process error: ${data.inputFilePath}`.red)
    }
    next(error)
  })

}