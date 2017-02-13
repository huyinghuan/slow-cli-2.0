import * as _plugin from '../plugin/index';
import * as _project from '../project';

import * as _path from 'path';
import _configFiledConstant from '../config-filed-constant';
import _getFullPluginName from './getFullPluginName';
import * as _fs from 'fs-extra';

//检查对比插件版本
export default function (needAppointVersion?:boolean):any{
  let configFiledConstant = _configFiledConstant.get();
  needAppointVersion = needAppointVersion ? true : false;
  let needAppointVersionList = [];
  //获取插件配置
  let pluginConfig = _configFiledConstant.getPluginConfig();
  //搜集需要对比的插件。开发版本将跳过。
  let pluginList = [];
  Object.keys(pluginConfig).forEach((pluginName)=>{
    if(/^(__)/.test(pluginName)){return}
    if(pluginConfig[pluginName] && pluginConfig[pluginName].__source){
      console.log(`警告: ${pluginName} 处于开发模式,跳过版本对比`.yellow);
      return
    }else if(pluginConfig[pluginName] == false){
      console.log(`警告: ${pluginName} 已被禁用`.yellow);
      return
    }
    //获取完整
    pluginName = _getFullPluginName(pluginName);
    pluginList.push(pluginName)
  })

  let packageJSON = _project.getProjectPackageJSON();
  let dependencies = packageJSON["dependencies"];
  let devDependencies = packageJSON["dev-dependencies"]
  if(pluginList.length == 0){
    return true;
  }

  if(!dependencies && !devDependencies){
    console.log(`警告! 配置插件列表唯恐， 如果有需要请先安装插件`.yellow);
    if(needAppointVersion){return pluginList}
    return false;
  }

  let isMatch = true;
  for(let i = 0, length = pluginList.length; i < length; i++){
    let pluginName = pluginList[i];
    let targetVersion:string = dependencies[pluginName] || devDependencies[pluginName];
    if(!_fs.existsSync(_path.join(configFiledConstant.pluginDir, pluginName))){
      console.log(`警告! 配置${pluginName}未安装,请先安装插件`)
      needAppointVersionList.push(pluginName)
      isMatch = false;
      continue;
    }

    let currentVersion:string = require(_path.join(configFiledConstant.pluginDir, pluginName, 'package.json')).version;

    if(targetVersion == currentVersion){
      continue;
    }
    console.log(`警告！插件：${pluginName} 项目依赖版本是 ${targetVersion}，实际版本是 ${currentVersion}`)
    needAppointVersionList.push(`${pluginName}@${targetVersion}`)
    isMatch = false;
  }
  if(needAppointVersion){return needAppointVersionList}
  return isMatch
}