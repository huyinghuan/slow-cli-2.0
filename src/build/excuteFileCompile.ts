import * as _path from 'path';
import * as _fs from 'fs-extra';
import * as _async from 'async'
import _compileFile from './compileFile'
import _log from '../lib/log';

import _configFiledConstant from '../config-filed-constant';
/**
 * 编译单个文件
 */
export default function (buildConfig, filepath, finish){
  let _workspace = _configFiledConstant.getWorkspace();
  //确保编译目录存在
  _fs.ensureDirSync(buildConfig.outdir);
  _fs.emptyDirSync(buildConfig.outdir);
  let realPath = _path.join(_workspace, filepath);
  if(!_fs.existsSync(realPath) || realPath.indexOf(_workspace) == -1){
    return finish(new Error('编译文件在项目中找不到'))
  }
  let fileName = realPath.split(_path.sep).pop();

  let fileData = {
    inputFilePath: realPath,
    outputFilePath: _path.join(buildConfig.outdir, filepath),
    outdir: buildConfig.outdir,
    outRelativeDir: buildConfig.outRelativeDir,
    inputFileRelativePath:  filepath,
    outputFileRelativePath: _path.join(buildConfig.outRelativeDir, filepath),
    fileName: fileName,
    appendFile: false,
    ignore: false
  }
  //compileFile(buildConfig, fileData, finish)
  let queue = [];
  queue.push((next)=>{
    _compileFile(buildConfig, fileData, (error)=>{
      next(error)
    })
  })
  //编译额外的文件
  queue.push((next)=>{
    _async.map(buildConfig.__extra, (fileData, cb)=>{
      _compileFile(buildConfig, fileData, cb)
    }, (error)=>{
      next(error)
    })
  })

  //删除标记文件
  queue.push((next)=>{
    try{
      buildConfig.__del.forEach((filepath)=>{
        _fs.removeSync(filepath);
        _log.info(`remove ${filepath}`)
      })
      next(null)
    }catch(e){
      next(e)
    }
  })

  _async.waterfall(queue, (error)=>{
    if(error){
      finish(error)
    }else{
      console.log("编译完成")
      finish(null)
    }
  })
}
