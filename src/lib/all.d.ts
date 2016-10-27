import * as _express from 'express';

export interface RouterCallBack{
  /**
   * stop 为真时， 停止启动静态服务器
   */
  (error:Object, stop:boolean):void
}

export interface CallBack{
  (error:Object, data):void
}



export interface HookCallBack{
  (router: _express.Router)
}