import * as _cb from '../all'
import * as _express from 'express';
import * as _colors from 'colors';
import * as _ from 'lodash';
import { loadPlugins } from '../init';

var HookQueue = {}

export function triggerHook(hookName:string, callback:_cb.CallBack){}

/**
  触发RouterHook, 可用于自定义路由操作
*/
export function triggerRouterHook(router:_express.Router, callback: _cb.RouterCallBack){
  callback && callback(null, false)
}

/**
 * 注册hooks
 */
export function registerHook(hookName:string, callback:_cb.CallBack){
  if(!HookQueue[hookName]){
    HookQueue[hookName] = []
  }
  //加入hook队列
  HookQueue[hookName].push(callback)
  console.log(`加载插件${hookName}成功`.blue)
}

export function sortHook(){
  //hooks排序
  Object.keys(HookQueue).forEach((key)=>{
    HookQueue[key] = _.sortBy(HookQueue[key], ['priority'], ['desc'])
  })
}

/**
 * 扫描Hooks插件
*/
export function scanPlugins(){
  
}

/**从源文件加载hooks */
export function loadPluginFromSource(pluginName:string, soucre:string){

}

/**
 * 从 ~/.xxx/node_modules
 */
export function loadPluginFromNodeModules(pluginName:string){

}