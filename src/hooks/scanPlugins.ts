import * as _ from 'lodash';
import * as _path from 'path';
import * as _async from 'async';
import * as _allDefined from '../all';
import _config from '../file-config';
import _registerHook from './registerHook';

/**加载hooks */
export function loadPlugin(pluginName:string, pluginPath, options:any, cb){
  try {
    let plugin = require(pluginPath);
    //默认权重
    if(_.isFunction(plugin.registerPlugin)){
      plugin.registerPlugin({
        registerHook: _registerHook,
        options: (global as any).__CLI
      }, options)
    }
    console.log(`加载插件${pluginName}成功`.blue)
    cb(null)
  } catch (error) {
    console.log(error)
    console.log(`加载插件 ${pluginName} 失败, 缺少注册函数`.red)
    cb(error)
  }
}

/**
 * 扫描Hooks插件
*/
export function scanPlugins(cb){
  let pluginsConfig = (global as any).__CLI.pluginsConfig;
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
    let pluginPath = pluginsConfig[pluginName].source || _path.join(_config.pluginDir, pluginName); 
    loadPlugin(pluginName, pluginPath, pluginsConfig[pluginName], next)
  }, (error)=>{
    cb(error)
  })
}