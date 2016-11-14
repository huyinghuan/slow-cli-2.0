import * as _express from 'express';

export interface RouterCallBack{
  /**
   * stop 为真时， 停止启动静态服务器
   */
  (error:Object, stop:boolean):void
}

export interface CompilerCallBack{
  /**
   * erorr  error信息
   * status  采用http status code 类似使用规则， 200:处理成功， 404:未找到文件
   * data  编译后的文件数据 
   */
  (error: Object, status: number, data):void
}

export interface WillResponseCallBack{
  /**
   * erorr  error信息
   * status  采用http status code 类似使用规则， 200:处理成功， 404:未找到文件
   * content  编译后的文件数据 
   */
  (error: Object, processContent:string):void
}


export interface CallBack{
  (error:Object, data):void
}



export interface HookCallBack{
  (router: _express.Router)
}

export interface BuildInitCallBack{
  (error:Object, stop)
}

export interface BuildWillDoCallBack{
  (error:Object, buildConfig)
}

export interface ProcessFile{
  fileName:string,
  filePath:string,
  relativeDir: string
}