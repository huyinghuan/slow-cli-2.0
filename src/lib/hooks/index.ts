import * as _allDefined from '../all'
import * as _express from 'express';
import * as _colors from 'colors';
import * as _ from 'lodash';
import * as _fs from 'fs-extra';
import * as _path from 'path';
import * as _async from 'async';
import _cli from '../index';
import _config from '../config';
import _hookMap from './map';

var HookQueue = {}

export function triggerHook(hookName:string, callback:_allDefined.CallBack){}

/**
  触发RouterHook, 可用于自定义路由操作
*/
export function triggerRouterHook(router:_express.Router, callback: _allDefined.RouterCallBack){
  let queue = HookQueue[_hookMap.route.initial];
  _async
}

/**
 * 注册hooks
 */
export function registerHook(hookName:string, callback:_allDefined.CallBack){
  if(!HookQueue[hookName]){
    HookQueue[hookName] = [];
  }
  //加入hook队列
  HookQueue[hookName].push({callback})
  console.log(`加载插件${hookName}成功`.blue)
}

//将插件加入到队列等待排序
function addHooksToQueue(){

}

/**
 * 扫描Hooks插件
*/
export function scanPlugins(){
  //读取工程目录下package.json配置
  let packageJSON = require(_path.join(process.cwd(), 'package.json'))
  let pluginsConfig = packageJSON[_config.pluginInfo.name]
  let plugins = Object.keys(pluginsConfig)
  for(let i = 0, len = plugins.length; i < len; i++){
    let pluginName = plugins[i];
    //从源文件加载插件或者从 插件目录加载插件
    let pluginPath = pluginsConfig[pluginName].source || _path.join(_config.pluginDir, pluginName); 
    loadPlugin(pluginName, pluginPath, pluginsConfig)
  }
}

/**从源文件加载hooks */
export function loadPlugin(pluginName:string, pluginPath, options:any){
  try {
    let plugin = require(options.source);
    //默认权重
    plugin.priority = plugin.priority ? ~~plugin.priority : 1;
    if(_.isFunction(plugin.registerPlugin)){
      plugin.registerPlugin(_cli, options)
    }
  } catch (error) {
    console.log(`加载插件 ${pluginName} 失败, 缺少注册函数 `.red)
  }
}