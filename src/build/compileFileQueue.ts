import * as _fs from 'fs-extra';
import * as _path from 'path';
import _compileFile from './compileFile'
import _configFiledConstant from '../config-filed-constant';
/**
 * 编译文件队列 */
export default async function(buildConfig, fileQueue){
  //确保编译目录存在
  _fs.ensureDirSync(buildConfig.outdir);
  //清空编译目录
  _fs.emptyDirSync(buildConfig.outdir);
  let queue = fileQueue.map((fileItem)=>{
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
    return _compileFile(buildConfig, data)
  })
  await Promise.all(queue)

  return buildConfig
}
