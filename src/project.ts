import * as _fs from 'fs-extra';
import _configFiledConstant from './config-filed-constant';
import getCLIVersion from './lib/getCLIVersion';
import checkCLIVersion from './lib/checkCLIVersion';

import * as _path from 'path';

//获取package.json某个字段的值
export function getProjectPackageJSONField(fieldName:string){
  let json = getProjectPackageJSON();
  return json[fieldName]
}

//返回packageJson内容
export function getProjectPackageJSON(fieldName?:string){
  if(!_fs.existsSync(_configFiledConstant.get().CLIConfigFile)){
    return {}
  }
  return  _fs.readJSONSync(_configFiledConstant.get().CLIConfigFile) //require(_configFiledConstant.CLIConfigFile)
}

//写入package.json文件
export function writeProjectPackageJSON(packageJSON){
  _fs.outputJSONSync(_configFiledConstant.get().CLIConfigFile, packageJSON)
}

//获取项目所在文件夹的文件夹名称
export function getProjectDirectoryName():string{
  return _configFiledConstant.getWorkspace().split(_path.sep).pop();
}

export {getCLIVersion as getCLIVersion}
export {checkCLIVersion as checkCLIVersion}