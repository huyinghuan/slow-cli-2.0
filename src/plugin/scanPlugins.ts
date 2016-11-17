import * as _path from 'path';
import * as _async from 'async';
import _config from '../file-config';
import _getFullPluginName from './getFullPluginName';
import * as _init from '../init/index';
import _loadPlugin from './loadPlugin';
import _getAllFileInDir from '../lib/getAllFileInDir';
import { plugin } from '../hooks/map';

//扫描加载内置插件
function scanDefaultPlugins(hookType:string, cb){
  let hookTypePluginDir = _path.join(__dirname, "default-plugin", hookType)
  let pluginArray = _getAllFileInDir(hookTypePluginDir, [], ".", (fileName, filePath)=> {return true});
  _async.map(pluginArray, (pluginItem, next)=>{
    _loadPlugin(hookType, "", pluginItem.filePath, {}, next)
  }, (error, result)=>{
    if(error){
      return console.log(error)
    }
    cb(null)
  })
}

/**
 * 扫描Hooks插件, 仅加载指定hook
*/
export default function scanPlugins(hookType:string, cb){
  let pluginsConfig = _init.getPluginConfig();
  if(!pluginsConfig){
    console.log(`没有配置任何插件`.red)
    return cb(null)
  }
  let plugins = Object.keys(pluginsConfig)

  _async.map(plugins, (pluginName, next)=>{
    if(!pluginsConfig[pluginName]){
      console.log(`插件 ${pluginName} 已被禁用`.red)
      return cb(null);
    }
    if(pluginsConfig[pluginName].source){
      console.log(`警告！！ ${pluginName} 加载方式为 开发者模式`.red)
    }
    //从自定义路径或插件目录获取插件路径
    let pluginPath = pluginsConfig[pluginName].source || _path.join(_config.pluginDir, _getFullPluginName(pluginName)); 
    _loadPlugin(hookType, pluginName, pluginPath, pluginsConfig[pluginName], next)
  }, (error)=>{
    if(error){
      return  cb(error)
    }
    scanDefaultPlugins(hookType, cb)
  })
}