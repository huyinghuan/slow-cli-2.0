import * as _fs from 'fs-extra';
import _fileConfig from '../file-config';
import getCLIVersion from './getCLIVersion';
import { getProjectPackageJSON } from '../init/index';

export default function():boolean{
  if(!_fs.existsSync(_fileConfig.CLIConfigFile)){
    console.log('默认执行环境，跳过CLI环境检查')
    return true;
  }
  let packageJSON = getProjectPackageJSON();
  let currentCLIVersion = getCLIVersion();
  let macth = packageJSON[_fileConfig.pluginVersionField] == currentCLIVersion;
  if(macth){
    return true
  }else{
    console.log(`警告: 项目要求${_fileConfig.infinity}版本是: ${packageJSON[_fileConfig.pluginVersionField]} ,本机实际版本为: ${currentCLIVersion}`.red)
    return false;
  }
}