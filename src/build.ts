import * as _init from './init/index';
import * as _hook from './hooks/index';
import * as _hookMap from './hooks/map';
import * as _async from 'async';
import * as _fs from 'fs-extra';
import * as _path from 'path';

import _getAllFileInDir from './lib/getAllFileInDir';
import { ProcessFile } from './all';

const _workspace = process.cwd();

/**
 * 是否应该处理该文件。
 * filename: string, filepath
 * return boolean. 
 * 如果忽略 返回false
 * 如果处理 返回true
 */
function shouldInclude(filename, filepath):boolean{
  const _buildConfig = _init.getBuildConfig();
  //console.log(filepath, _buildConfig.outdir, filepath.indexOf(_buildConfig.outdir))
  //忽略build文件夹
  if(filepath.indexOf(_buildConfig.outdir) != -1){
    return false
  }

  //需要忽略掉文件
  const buildIgnore:Array<string> = _buildConfig.ignore;
  for(let i = 0, length = buildIgnore.length; i < length; i++){
    if(new RegExp(buildIgnore[i]).test(filepath)){
      return false
    }
  }
  return true
}

/**
 * 编译单个文件
 * 触发发各类hook，doCompile, didCompile*/
function compileFile(data, next){
  let queue = [];

  //编译工具编译
  queue.push((cb)=>{
    _hook.triggerBuildDoCompileHook(data, cb)
  })

  //内容加工
  queue.push((data, content, cb)=>{
    _hook.triggerBuildDidCompileHook(data, content, cb)
  })

  /**
   * 已经编译完成，写入文件。
   * 未完成编译， 触发hook， hook如果已经写入文件，那么不做任何事情， 如果没有写入文件， 那么默认copy文件。
   */
  queue.push((data, content, cb)=>{
    if(content){
      return _fs.writeFile(data.outputFilePath, content, (error)=>{
        cb(error)
      })
    }
    _hook.triggerBuildDoNothingHook(data, (error, processResult:any)=>{
      if(error){return cb(error)}

      if(processResult.hasProcess){
        return cb(null)
      }

      _fs.copy(processResult.inputFilePath, processResult.outputFilePath, (error)=> {cb(error)})

    })
  })

  _async.waterfall(queue, (error)=> next(error))

}

/**
 * 编译文件队列 */
function compilerFileQueue(buildConfig, fileQueue, next){
  //确保编译目录存在
  _fs.ensureDirSync(buildConfig.outdir);
  //清空编译目录
  _fs.emptyDirSync(buildConfig.outdir);
  //异步编译
  _async.map(fileQueue, (fileItem:any, cb)=>{
    let data = {
      inputFilePath: fileItem.filePath,
      outputFilePath: _path.join(process.cwd(), buildConfig.outdir, fileItem.relativeDir, fileItem.fileName),
      fileName: fileItem.fileName
    }
    compileFile(data, cb)
  }, (error, result)=>{
    next(error, buildConfig)
  })
}

function normalExecute(){
  let queue = [];
  //获取所有待编译文件
  let fileQueue:Array<Object> = _getAllFileInDir(_workspace, [], '.', shouldInclude);
  //获取编译参数
  let buildConfig = _init.getBuildConfig()

  //将要编译了
  queue.push((next)=>{
    _hook.triggerBuildWillDoHook(buildConfig, next)
  })

  //处理文件队列
  queue.push((buildConfig, next)=>{
    //编译文件
    compilerFileQueue(buildConfig, fileQueue, next)
  })

  //didBuild 
  queue.push((buildConfig, next)=>{
    next(null)
  })

  //endBuild 打包压缩 发送
  queue.push((next)=>{
    console.log('build end!')
    next(null)
  })
  _async.waterfall(queue, (error)=>{
    console.log(error)

  })


}

export default function(){
  let queue = [];
  //加载插件
  queue.push((cb)=>{
    _hook.scanPlugins('build', cb)
  });

  //build初始化HOOK
  queue.push((cb)=>{_hook.triggerBuildInitHook(cb);});

  _async.waterfall(queue, (error, stop)=>{
    if(error){
      console.log(error);
      console.log('build 初始化失败'.red);
      _hook.triggerBuildErrorHook(error);
      return;
    }
    if(stop){return}
    normalExecute()
  })
}