/**
 * 用于检测，获取项目相关信息
 */
import * as _path from 'path';

export function getProjectDirectoryName():string{
  return process.cwd().split(_path.sep).pop()
}

export function getCLIVersion():string{
  return require('../package').version;
}