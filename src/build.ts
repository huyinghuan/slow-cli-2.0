import * as _async from 'async';
import * as _fs from 'fs-extra';
import * as _path from 'path';
import * as _init from './init/index';
import * as _hook from './hooks/index';
import * as _plugin from './plugin/index';
import * as _hookMap from './hooks/map';
import _log from './lib/log';


import _getAllFileInProject from './lib/getAllFileInProject';

const _workspace = process.cwd();


/**
 * 编译单个文件
 * 触发发各类hook，doCompile, didCompile*/
function compileFile(buildConfig, data, next){
  let queue = [];

  //编译工具编译
  queue.push((cb)=>{
    _hook.triggerBuildDoCompileHook(buildConfig, data, cb)
  })

  //内容加工
  queue.push((data, content, cb)=>{
    _hook.triggerBuildDidCompileHook(buildConfig, data, content, cb)
  })

  /**
   * 已经编译完成，写入文件。
   * 如果没有任何内容，则跳过, 如果ignore为true也跳过
  */
  queue.push((data, content, cb)=>{
    if(!content || data.ignore){
      return cb(null, false, data)
    }

    let outputFilePathArr = [].concat(data.outputFilePath);
    let appendFile = data.appendFile;
    try{
      //如果一个内容要输出到多个文件
      outputFilePathArr.forEach((outputFilePath)=>{

        if(!appendFile){
          _fs.outputFileSync(outputFilePath, content)
        }else{
          _log.info(`append ${data.inputFileRelativePath} to ${data.outputFileRelativePath}`)
          if(!_fs.existsSync(outputFilePath)){
            _fs.outputFileSync(outputFilePath, content)
          }else{
            _fs.appendFileSync(outputFilePath, content, {encoding: 'utf8'})
          }
        }
      
    })
    }catch(e){
      return cb(e)
    }
    cb(null, true, data)
  })
  
  /* 未完成编译， 触发hook， hook如果已经写入文件，那么不做任何事情， 如果ignore为true也不做任何事情
   如果没有写入文件， 那么默认copy[调用默认hook(plugin/default-plugin/build/*)]文件。*/
  queue.push((didWrite, data, cb)=>{
    if(didWrite || data.ignore){return cb(null, data)}
    _hook.triggerBuildDoNothingHook(buildConfig, data, (error, processResult:any)=>{
      if(error){return cb(error)}

      if(processResult.hasProcess){
        return cb(null, data)
      }
      _log.info(`忽略文件: ${processResult.inputFilePath}`);
      cb(null, data)
    })
  })

  _async.waterfall(queue, (error, data)=>{
    if(error){
      console.log(error)
      console.log(`process error: ${data.inputFilePath}`.red)
    }
    next(error)
  })

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
      outputFilePath: _path.join(buildConfig.outdir, fileItem.relativeDir, fileItem.fileName),
      outdir: buildConfig.outdir,
      outRelativeDir: buildConfig.outRelativeDir,
      inputFileRelativePath:  _path.join(fileItem.relativeDir, fileItem.fileName),
      outputFileRelativePath: _path.join(buildConfig.outRelativeDir, fileItem.relativeDir, fileItem.fileName),
      fileName: fileItem.fileName,
      appendFile: false,
      ignore: false
    }
    compileFile(buildConfig, data, cb)
  }, (error, result)=>{
    next(error, buildConfig)
  })
}

function normalExecute(){
  let queue = [];
  //获取所有待编译文件
  let fileQueue:Array<Object> = _getAllFileInProject(false);
  //获取编译参数
  let buildConfig = _init.getBuildConfig()
  //额外需要编译的文件
  buildConfig.__extra = [];
  //编译完成后需要删除掉冗余文件
  buildConfig.__del = [];
  //将要编译了
  queue.push((next)=>{
    _hook.triggerBuildWillDoHook(buildConfig, next)
  })

  //处理文件队列 （doCompile，didCompile，doNothing) in there
  queue.push((buildConfig, next)=>{
    //编译文件
    compilerFileQueue(buildConfig, fileQueue, next)
  })
  /**/
  //处理额外的文件， 比如html中提取出来的js src， css link等文件合并
  queue.push((buildConfig, next)=>{
    _async.map(buildConfig.__extra, (fileData, cb)=>{
      compileFile(buildConfig, fileData, cb)
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
  
  //endBuild gzip 发送
  queue.push((buildConfig, next)=>{
    _hook.triggerBuildEndHook(buildConfig, next)
  })
  
  _async.waterfall(queue, (error)=>{
    if(error){
      _log.error(error);
      _log.error("build fail".red);
      _hook.triggerBuildErrorHook(error);
      return process.exit(1)
    }
    console.log("build success".green)
    
  })
}

export default function(){

  //加载插件
  _plugin.scanPlugins('build')

  let queue = [];
  //build初始化HOOK
  queue.push((cb)=>{_hook.triggerBuildInitHook(cb);});

  _async.waterfall(queue, (error, stop)=>{
    if(error){
      _log.error(error);
      _log.fail('build 初始化失败'.red);
      _hook.triggerBuildErrorHook(error);
      return;
    }
    if(stop){return}
    normalExecute()
  })
}