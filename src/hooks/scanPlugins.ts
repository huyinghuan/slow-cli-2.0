import * as _ from 'lodash';
import * as _path from 'path';
import * as _async from 'async';
import * as _allDefined from '../all';
import _config from '../file-config';
import _registerHook from './registerHook';
import _getFullPluginName from './getFullPluginName';
import * as _init from '../init/index';

/**
 * 加载指定类型hooks
 * hookType  hook类型，如start只用到了route 类型， build只用了build类型， 加载所有用 all
 * pluginName 插件名字
 * pluginPath 插件路径
 * option 插件配置
 * cb 回调函数
 *  */
export function loadPlugin(hookType:string, pluginName:string, pluginPath:string, options:any, cb){
  try {
    let plugin = require(pluginPath);
    //默认权重
    if(_.isFunction(plugin.registerPlugin)){
      plugin.registerPlugin({
        registerHook: (hookName:string, callback:_allDefined.CallBack, priority?:number)=>{
          if(hookName.indexOf(hookType) == 0 || hookType == 'all'){
            _registerHook(hookName, callback, priority);
            console.log(`加载插件${pluginName}'s hook ${hookName} 成功`.blue)
            return
          }
        },
        options: _init.getFullConfig()
      }, options)
    }
    cb(null)
  } catch (error) {
    console.log(error)
    console.log(`加载插件 ${pluginName} 失败, 缺少注册函数`.red)
    cb(error)
  }
}

/**
 * 扫描Hooks插件, 仅加载指定hook
*/
export function scanPlugins(hookType:string, cb){
  let pluginsConfig = _init.getPluginConfig();
  if(!pluginsConfig){
    console.log(`没有配置任何插件`.red)
    return cb(null)
  }
  let plugins = Object.keys(pluginsConfig)

  _async.map(plugins, (pluginName, next)=>{
    if(!pluginsConfig[pluginName]){
      console.log(`插件 ${pluginName} 已被禁用`.red)
    }
    if(pluginsConfig[pluginName].source){
      console.log(`警告！！ ${pluginName} 加载方式为 开发者模式`.red)
    }
    //从自定义路径或插件目录获取插件路径
    let pluginPath = pluginsConfig[pluginName].source || _path.join(_config.pluginDir, _getFullPluginName(pluginName)); 
    loadPlugin(hookType, pluginName, pluginPath, pluginsConfig[pluginName], next)
  }, (error)=>{
    cb(error)
  })
}