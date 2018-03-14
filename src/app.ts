import * as _express from 'express';
import * as _http from 'http';
import * as _async from 'async';
import * as _fs from 'fs';
import * as _path from 'path';
import _configFiledConstant from './config-filed-constant';
import { CompilerCallBack } from './all';
import * as _hooks from './hooks/index';
import * as _hooksMap from './hooks/map';
import _getMime from './lib/getMime';

import * as _plugin from './plugin/index';
import _log from './lib/log';
import * as _httpUtils from './http-utils'
/**
 * 启动静态服务
 */
export default ()=>{
  //加载插件
  _plugin.scanPlugins('route');
  let app = _express();
  let router = _express.Router();
  let globalCLIConfig = _configFiledConstant.getGlobal()

  return async (request, response)=>{
    _httpUtils.showResponseTime(request, response)
    //启动服务器之前
    if(_hooks.triggerRouter("initial", router)){
     return;
    }

    let requestData = _httpUtils.parseURL(request.url)

    //拦截文件夹请求
    let isDir = await _httpUtils.isDir(requestData.path)
    if(isDir){
      let content = await _hooks.triggerRouter("dir", requestData.path)
      if(content){
        response.setHeader('Content-Type', "text/html")
        response.write(content, "utf8")
        response.end()
        return
      }
    }
    
    //基本数据
    let req = {
      path:  requestData.path,
      query: requestData.query
    }

    //拦截GET请求，并且加载编译其他hooks
    let realPath = requestData.path;
    if(realPath == '/'){
      realPath = globalCLIConfig.index || "index.html"
    }
    let data:any = {
      status: 404,
      realPath: realPath
    }

    //路径转发
    await _hooks.triggerRouter("forward", req, data)
    let content = await _hooks.triggerRouter("didRequest", req, data)
    content = _hooks.triggerRouter("willResponse", req, data, content)

    //404 nofound
    let hasProcess = await _hooks.triggerRouter("notFound", req, response)
    if(!hasProcess){
      response.statusCode = 404;
      response.statusMessage = "no file"
      response.end("404 no file")
    }
  }

  // //拦截GET请求，并且加载编译其他hooks
  // router.all('*', function (request, resp, next){
 

  //   queue.push((cb:CompilerCallBack)=>{
  //     _hooks.triggerRouter("didRequest", req, data, cb)
  //   });

  //   //TODO  min js,css, html, autoprefix
  //   //対编译后内容的加工处理
  //   queue.push((responseContent, cb)=>{
  //     _hooks.triggerRouter("willResponse", req, data, responseContent, cb)
  //   });

  //   // outout mime and responseContent
  //   queue.push((responseContent, cb)=>{
  //     //文件没有经过任何编译工具处理。
  //     if(data.status == 404){
  //       return cb(null)
  //     }
  //     let mime = _getMime(data.   );
  //     let responseMimeType = data.ContentType || mime;
  //     resp.set('Content-Type', responseMimeType);
  //     resp.send(responseContent)
  //     cb(null, true)

  //   })

  //   _async.waterfall(queue, (error, hasProcess)=>{
  //     if(error){
  //       console.log(error)
  //       resp.status(500)
  //       resp.send(error)
  //     }else{
  //       //交给自带的静态文件处理
  //       if(!hasProcess){
  //         next();
  //       }
  //     }
  //   })
  // });

  // app.use(router)

  //return app
}