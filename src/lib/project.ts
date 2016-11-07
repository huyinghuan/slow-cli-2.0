/**
 * 用于检测，获取项目相关信息
 */
import * as _path from 'path';
import _fileConfig from '../file-config';
import * as _fs from 'fs-extra';
import { getProjectPackageJSON } from '../init/index';

export function getProjectDirectoryName():string{
  return process.cwd().split(_path.sep).pop()
}

export function getCLIVersion():string{
  return require('../package').version;
}

export function checkCLIVersion():boolean{

  if(!_fs.existsSync(_fileConfig.CLIConfigFile)){
    console.log('默认执行环境，跳过CLI环境检查')
    return true;
  }

  let packageJSON = getProjectPackageJSON();
  let currentCLIVersion = getCLIVersion();

}