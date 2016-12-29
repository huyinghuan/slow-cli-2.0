import * as _fs from 'fs-extra';
import * as _async from 'async';
import * as _path from 'path';
import _compileFile from './compileFile'
import _configFiledConstant from '../config-filed-constant';
/**
 * 编译文件队列 */
export default function(buildConfig, fileQueue, next){
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
    _compileFile(buildConfig, data, cb)
  }, (error, result)=>{
    next(error, buildConfig)
  })
}
