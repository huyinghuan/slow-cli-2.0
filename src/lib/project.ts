/**
 * 用于检测，获取项目相关信息
 */
import * as _path from 'path';

import getCLIVersion from './getCLIVersion';
import checkCLIVersion from './checkCLIVersion';

export function getProjectDirectoryName():string{
  return process.cwd().split(_path.sep).pop();
}

export {getCLIVersion as getCLIVersion}
export {checkCLIVersion as checkCLIVersion}



