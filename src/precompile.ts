import * as _hooks from './hooks/index';
import * as _plugin from './plugin/index';
import _getAllFileInProject from './lib/getAllFileInProject';
import _getGitHash from './lib/getGitHash';
import _configFiledConstant from './config-filed-constant';
import _log from './lib/log';
import * as _fs from 'fs-extra';
import * as _path from 'path';

async function precompileFile(buildConfig, fileItem, content){
  let outpufFilePath = _path.join(buildConfig.outdir, fileItem.relativeDir, fileItem.fileName)
  _fs.ensureFileSync(outpufFilePath)
  content = await _hooks.triggerPrecompile('include', buildConfig, fileItem, content)
  content = await _hooks.triggerPrecompile('insert', buildConfig, fileItem, content)
  content = await _hooks.triggerPrecompile('replace', buildConfig, fileItem, content)
  _fs.writeFileSync(outpufFilePath, content)
}


export async function compile(){
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
   let successCount = 0;
   for(let i = 0, len = targetFileQueue.length; i < len; i++){
    let content = _fs.readFileSync(targetFileQueue[i].filePath, {encoding:"utf8"})
    try{
      await precompileFile(buildConfig, targetFileQueue[i], content)
      successCount = successCount + 1
    }catch(e){
      console.log(e)
    }
   }
   _log.info(`完成预编译文件:${successCount}个`)
}