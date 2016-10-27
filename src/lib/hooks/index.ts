import * as _allDefined from '../all'
import * as _express from 'express';
import * as _ from 'lodash';
import * as _fs from 'fs-extra';
import * as _path from 'path';
import * as _async from 'async';
import _config from '../config';
import _hookMap from './map';
//坑 import * as _colors from 'colors';
require('colors');

var HookQueue = {}

export function triggerHook(hookName:string, callback:_allDefined.CallBack){}

/**
*触发RouterHook, 可用于自定义路由操作
* 返回 true 停止其他hook，
* 返回 false 使用其他hook
*/
export function triggerRouterHook(router:_express.Router):boolean{
  let queue = HookQueue[_hookMap.route.initial];
  for(let i = 0, length = queue.length; i < length; i++){
    if(queue[i].fn(router)){
      return true;
    }
  }
  return false
}

/**
 * 注册hooks
 * priority  优先级
 */
export function registerHook(hookName:string, callback:_allDefined.CallBack, priority?:number){
  priority = ~~priority ? ~~priority : 1
  if(!HookQueue[hookName]){
    HookQueue[hookName] = [];
  }
  //加入hook队列
  HookQueue[hookName].push({fn:callback, priority: priority})
  
  //排序
  sortHook(hookName)
}

//排序
function sortHook(hookName){
  HookQueue[hookName] = _.orderBy(HookQueue[hookName], 'priority', 'desc')
}


/**
 * 扫描Hooks插件
*/
export function scanPlugins(cb){
  //读取工程目录下package.json配置
  let packageJSON = require(_path.join(process.cwd(), 'package.json'))
  let pluginsConfig = packageJSON[_config.pluginInfo.name]
  let plugins = Object.keys(pluginsConfig)

  _async.map(plugins, (pluginName, next)=>{
    //从自定义路径或插件目录获取插件路径
    let pluginPath = pluginsConfig[pluginName].source || _path.join(_config.pluginDir, pluginName); 
    loadPlugin(pluginName, pluginPath, pluginsConfig[pluginName], next)
  }, (error)=>{
    cb(error)
  })

}

/**加载hooks */
export function loadPlugin(pluginName:string, pluginPath, options:any, cb){
  try {
    let plugin = require(pluginPath);
    //默认权重
    if(_.isFunction(plugin.registerPlugin)){
      plugin.registerPlugin({
        registerHook: registerHook,
        __CLI: (global as any).__CLI
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