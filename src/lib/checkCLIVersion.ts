import * as _fs from 'fs-extra';
import _configFiledConstant from '../config-filed-constant';
import getCLIVersion from './getCLIVersion';
import * as _project from '../project';

export default function():boolean{
  let configFiledConstant = _configFiledConstant.get()
  if(!_fs.existsSync(configFiledConstant.CLIConfigFile)){
    console.log('默认执行环境，跳过CLI环境检查')
    return true;
  }
  let packageJSON = _project.getProjectPackageJSON();
  let currentCLIVersion = getCLIVersion();
  let macth = packageJSON[configFiledConstant.pluginVersionField] == currentCLIVersion;
  if(macth){
    return true
  }else{
    console.log(`警告: 项目要求${configFiledConstant.infinity}版本是: ${packageJSON[configFiledConstant.pluginVersionField]} ,本机实际版本为: ${currentCLIVersion}`.red)
    return false;
  }
}