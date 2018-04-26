import * as _path from 'path';
import * as _fs from 'fs-extra';
import _compileFile from './compileFile'
import _log from '../lib/log';

import _configFiledConstant from '../config-filed-constant';
/**
 * 编译单个文件
 */
export default async function (buildConfig, filepath){
  let _workspace = _configFiledConstant.getWorkspace();
  //确保编译目录存在
  _fs.ensureDirSync(buildConfig.outdir);
  _fs.emptyDirSync(buildConfig.outdir);
  let realPath = _path.join(_workspace, filepath);
  if(!_fs.existsSync(realPath) || realPath.indexOf(_workspace) == -1){
    throw new Error('编译文件在项目中找不到')
  }
  let fileName =  _path.parse(realPath).base

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
  await  _compileFile(buildConfig, fileData)

  //编译额外的文件
 let queue = [];
  /**/
  //处理额外的文件， 比如html中提取出来的js src， css link等文件合并
  buildConfig.__extra.forEach(fileData => {
    queue.push(_compileFile(buildConfig, fileData))
  });
  await Promise.all(queue)

  //删除标记文件
  buildConfig.__del.forEach((filepath)=>{
    _fs.removeSync(filepath);
    _log.info(`remove ${filepath}`)
  })
  console.log("编译完成")
}
