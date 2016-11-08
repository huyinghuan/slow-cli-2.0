import * as _hooks from '../hooks/index';
import { getProjectPackageJSON } from '../init/index';
import * as _path from 'path';
import _fileConfig from '../file-config';
//检查对比插件版本
export default function ():boolean{
  //获取插件配置
  let pluginConfig = (global as any).__CLI.pluginsConfig;
  //搜集需要对比的插件。开发版本将跳过。
  let pluginList = [];
  Object.keys(pluginConfig).forEach((pluginName)=>{
    if(pluginConfig[pluginName] && pluginConfig[pluginName].source){
      console.log(`警告: ${pluginName} 处于开发模式,跳过版本对比`.yellow);
      return
    }
    //获取完整
    pluginName = _hooks.getFullPluginName(pluginName);
    pluginList.push(pluginName)
  })

  let packageJSON = getProjectPackageJSON();
  let dependencies = packageJSON.dependencies;
  
  if(!dependencies && pluginList.length != 0){
    console.log(`警告! 配置插件未安装， 请先安装插件`.yellow);
    return false;
  }

  if(pluginList.length == 0){
    return true;
  }

  let isMatch = true;
  for(let i = 0, length = pluginList.length; i < length; i++){
    let pluginName = pluginList[i];
    let targetVersion = dependencies[pluginName];
    let currentVersion = require(_path.join(_fileConfig.pluginDir, pluginName, 'package.json')).version;
    if(targetVersion == currentVersion){
      continue;
    }
    console.log(`警告！插件：${pluginName} 项目依赖版本是 ${targetVersion}，实际版本是 ${currentVersion}`)
    isMatch = false;
  }
  return isMatch
}