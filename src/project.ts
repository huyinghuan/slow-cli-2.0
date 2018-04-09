import * as _fs from 'fs-extra';
import _configFiledConstant from './config-filed-constant';
import * as cli from './cli'
import * as _ from 'lodash'
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
//更新 package.json文件某个字段
export function updateProjectPackageJSON(params){
  let packageJSON = getProjectPackageJSON()
  packageJSON = _.extend(packageJSON, params)
  writeProjectPackageJSON(packageJSON)
}

export function updateProjectCLIVersion(version?:string){
   version = version || cli.getVersion()
   let params = {}
   params["silky-version"] = version
   updateProjectPackageJSON(params)
}

//获取项目所在文件夹的文件夹名称
export function getProjectDirectoryName():string{
  return _configFiledConstant.getWorkspace().split(_path.sep).pop();
}