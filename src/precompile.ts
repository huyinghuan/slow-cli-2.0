import * as _hooks from './hooks/index';
import * as _plugin from './plugin/index';
import _getAllFileInProject from './lib/getAllFileInProject';
import * as _async from 'async';
import _getGitHash from './lib/getGitHash';
import _configFiledConstant from './config-filed-constant';
import _log from './lib/log';
import * as _fs from 'fs-extra';
import * as _path from 'path';

function precompileFile(buildConfig, fileItem, content, finish){
  let outpufFilePath = _path.join(buildConfig.outdir, fileItem.relativeDir, fileItem.fileName)
  _fs.ensureFileSync(outpufFilePath)
  let queue = []
  queue.push((cb)=>{
    _hooks.triggerPrecompile('include', buildConfig, fileItem, content, (error, content)=>{
      cb(error, content)
    })
  })
  _async.waterfall(queue, (error, content)=>{
    if(error){
      finish(error)
    }else{
      _fs.writeFileSync(outpufFilePath, content)
      finish()
    }
  })
}


export function compile(){
  _plugin.scanPlugins('precompile')
  //获取所有待编译文件
  let fileQueue:Array<Object> = _getAllFileInProject(false);
  let targetFileQueue = [];
  fileQueue.forEach((item:any)=>{
    if(item.fileName.indexOf(".hbs")!=-1){
      targetFileQueue.push(item)
    }
  })
  _log.info(`预编译文件:${targetFileQueue.length}个`)
  let __starTime = Date.now();
  let queue = [];
  let gitHash = _getGitHash();
  let buildConfig = _configFiledConstant.getBuildConfig({gitHash:gitHash})
   //确保编译目录存在
   _fs.ensureDirSync(buildConfig.outdir);
   //清空编译目录
   _fs.emptyDirSync(buildConfig.outdir);
  _async.map(targetFileQueue, (item, cb)=>{
    _fs.readFile(item.filePath, {encoding:"utf8"}, (error, content)=>{
      if(error){
        return cb(error)
      }
      precompileFile(buildConfig, item, content, cb)
    })
  }, (err:any, result)=>{
    if(err){
      console.log(err)
    }else{
      _log.info(`完成预编译文件:${result.length}个`)
    }
  })
  //_hooks.triggerPrecompile("")
}