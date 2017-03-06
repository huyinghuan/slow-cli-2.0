import * as _path from 'path';
import * as _async from 'async';
import _configFiledConstant from '../config-filed-constant';
import _getFullPluginName from './getFullPluginName';
import * as _plugin from '../plugin/index';
import _loadPlugin from './loadPlugin';
import _getAllFileInDir from '../lib/getAllFileInDir';
import _log from '../lib/log';
//扫描加载内置插件
function scanDefaultPlugins(hookType:string){
  //指定类型的hook
  let hookTypePluginDir = _path.join(__dirname, "default-plugin", hookType)
  let pluginArray = _getAllFileInDir(hookTypePluginDir, [], ".", (fileName, filePath)=> {return true});
  //通用的类型的hook
  let commonHookTypePlugiDir = _path.join(__dirname, "default-plugin", 'commom')
  let commonPluginArray = _getAllFileInDir(commonHookTypePlugiDir, [], ".", (fileName, filePath)=> {return true});

  let allPlugin = pluginArray.concat(commonPluginArray)
  allPlugin.forEach((pluginItem)=>{
     _loadPlugin(hookType, "", pluginItem.filePath, {})
  })
}

//获取开发中的插件实际位置
function getDevPluginPath(source):string{
  if(!source){return ""}
  //是否为绝对路径
  if(_path.isAbsolute(source)){
    return source;
  }
  //是否设置了根目录 没有设置 取执行目录为根目录
  let pluginRootDir = _configFiledConstant.getPluginConfig('__root') || _configFiledConstant.getWorkspace()
  return _path.join(pluginRootDir, source)
}

/**
 * 扫描Hooks插件, 仅加载指定hook
*/
export default function scanPlugins(hookType:string){
  let configFiledConstant = _configFiledConstant.get()
  let __startTime = Date.now();
  let pluginsConfig = _configFiledConstant.getPluginConfig();
  if(!pluginsConfig){
    console.log(`没有配置任何插件`.red)
    return
  }
  let plugins = [];
  let pluginExts = [];

  Object.keys(pluginsConfig).forEach((key)=>{
    //忽略配置
    if(/^(__)/.test(key)){
      return;
    }
    //插件扩展
    if(/^sp\-.+(\-ext)$/.test(key)){
      pluginExts.push(key)
      return
    }
    //插件
    if(/^sp-.+/.test(key)){
      plugins.push(key)
      return
    }
  })
  //插件扩展优先加载，使得调用注册插件时，可以灵活使用。
  plugins = pluginExts.concat(plugins)
  plugins.forEach((pluginName)=>{
    if(!pluginsConfig[pluginName]){
      console.log(`插件 ${pluginName} 已被禁用`.red)
      return;
    }
    if(pluginsConfig[pluginName].__source){
      console.log(`警告！！ ${pluginName} 加载方式为 开发者模式`.red)
    }

    //从自定义路径或插件目录获取插件路径
    let pluginPath = getDevPluginPath(pluginsConfig[pluginName].__source) || _path.join(configFiledConstant.pluginDir, _getFullPluginName(pluginName));
    let __loadStart = Date.now();
    _loadPlugin(hookType, pluginName, pluginPath, pluginsConfig[pluginName])
    if(pluginsConfig[pluginName].__stop != true){
       _log.info(`加载 ${pluginName} 用时 ${Date.now() - __loadStart}ms`)
    }
   
  });

  _log.info(`加载插件用时 ${Date.now() - __startTime}ms`)

  //内置插件
  scanDefaultPlugins(hookType)
}