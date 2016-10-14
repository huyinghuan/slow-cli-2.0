import * as _cb from '../all'
import * as _express from 'express';

export function triggerHook(hookName:string, callback:_cb.CallBack){}

/**
  触发RouterHook, 可用于自定义路由操作
  
*/
export function triggerRouterHook(router:_express.Router, callback: _cb.RouterCallBack){

}

export function registerHook(hookName:string, callback:_cb.CallBack){

}

