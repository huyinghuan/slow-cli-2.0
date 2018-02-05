import * as _express from 'express';
import * as _http from 'http';
import * as _async from 'async';
import * as _fs from 'fs';
import * as _path from 'path';

import { CompilerCallBack } from './all';
import * as _hooks from './hooks/index';
import * as _hooksMap from './hooks/map';
import _getMime from './lib/getMime';
import _configFiledConstant from './config-filed-constant';
import * as _plugin from './plugin/index';
import _log from './lib/log';
import _formatContentLength from './lib/fortmatContentLength'
/**
 * 启动静态服务
 */
export default ()=>{
  //加载插件
  _plugin.scanPlugins('route');
  let app = _express();
  let router = _express.Router();
  let globalCLIConfig = _configFiledConstant.getGlobal()

  //启动静态服务器
  //增加一些基础信息
  router.all('*', function(req, resp, next){
    //挂载时间点
    (req as any).__acceptTime = Date.now();
    //显示请求耗费时间
    resp.on('finish', ()=>{
      let startTime = (req as any).__acceptTime;
      let spellTime = new Date().getTime() - startTime
      let msg = `( ${req.url} ): ${spellTime} ms: [${resp.statusCode}] size:`
      switch(resp.statusCode){
        case 304 : _log.info(msg.grey); break;
        case 401:
        case 403:
        case 404:
        case 500:  _log.error(msg.red); break;
        default:
          _log.info(msg.gray, `${_formatContentLength((resp as any)._contentLength)}`);
      }
      _hooks.triggerHttpDidResponseHook(req);
    })
    next()
  });

  //拦截文件夹请求
  router.get('*', function(req, resp, next){
    let path = req.path;
    _fs.stat(_path.join(_configFiledConstant.getWorkspace(), path), (error, stat)=>{
      if(error){
        return next()
      }
      if(!stat.isDirectory() || !_configFiledConstant.getGlobal('autoindex')){
        return next()
      }

      _hooks.triggerHttpResponseDirHook(path, (error, content)=>{
        if(error){
          _log.error(error)
          resp.status(500)
          resp.send(error)
          return
        }
        if(content){
          resp.set('Content-Type', "text/html");
          resp.send(content)
        }else{
          next()
        }
      })
    })
  })

  //启动服务器之前
  //_hooksMap.route.initial
  if(_hooks.triggerHttpRouterHook(router)){
    return;
  }

  //拦截GET请求，并且加载编译其他hooks
  router.all('*', function(request, resp, next){
    let queue = [];
    let req = {
      path:  request.path,
      query: request.query
    }
    let realPath = req.path;
    if(realPath == '/'){
      realPath = globalCLIConfig.index || "index.html"
    }
    let data:any = {
      status: 404,
      realPath: realPath
    }
    //转换/forward路径
    queue.push((cb: Function)=>{
      _hooks.triggerRouter("forward", req, data, cb)
    })

    queue.push((cb:CompilerCallBack)=>{
      //route:didRequest
      console.log(req.path, data.realPath)
      _hooks.triggerHttpCompilerHook(req, data, cb)
    });

    //TODO  min js,css, html, autoprefix
    //対编译后内容的加工处理
    queue.push((responseContent, cb)=>{
      //route:willResponse
      _hooks.triggerHttpWillResponseHook(req, data, responseContent, cb)

    });

    // outout mime and responseContent
    queue.push((responseContent, cb)=>{
      //文件没有经过任何编译工具处理。
      if(data.status == 404){
        return cb(null)
      }
      let mime = _getMime(data.realPath);
      let responseMimeType = data.ContentType || mime;
      resp.set('Content-Type', responseMimeType);
      resp.send(responseContent)
      cb(null, true)

    })

    _async.waterfall(queue, (error, hasProcess)=>{
      if(error){
        console.log(error)
        resp.status(500)
        resp.send(error)
      }else{
        //交给自带的静态文件处理
        if(!hasProcess){
          next();
        }
      }
    })
  });

  //如果其他编译hook没有完成编译，那么则使用默认文件发送
  router.all('*', function(req, resp, next){
    _hooks.triggerHttpNoFoundHook(req, resp, (hasProcess)=>{
      if(!hasProcess){
        resp.sendStatus(404);
      }
    })
  })

  app.use(router)

  return app
}