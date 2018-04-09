import * as _http from 'http';
import * as _fs from 'fs';
import * as _path from 'path';
import * as _url from 'url'
import * as _querystring from 'querystring'
import * as _ from 'lodash';
import { CompilerCallBack } from './all';
import * as _hooks from './hooks/index';
import * as _hooksMap from './hooks/map';
import _getMime from './lib/getMime';
import _configFiledConstant from './config-filed-constant';
import * as _plugin from './plugin/index';
import _log from './lib/log';
import _formatContentLength from './lib/fortmatContentLength'
import _getGitHash from './lib/getGitHash'
import * as _init from './init/index'

const showResponseTime = function(req, resp){
  let startTime = Date.now()
  resp.on('finish', ()=>{
    let spellTime = Date.now() - startTime
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
  })
}

const parseURL = function(url:string){
  let urlObj = _url.parse(url)
  urlObj.query = _querystring.parse(urlObj.query)
  urlObj.path = urlObj.pathname
  return urlObj
}

/**
 * 启动静态服务
 */
export function privewServer(healthCheck?:string){
  if(healthCheck){
    _fs.writeFileSync("server-status.dat", healthCheck, "utf8")
  }else{
    if(!_fs.existsSync("server-status.dat")){
      _fs.writeFileSync("server-status.dat", 200, "utf8")
    }
  }
  
  _plugin.scanPlugins('preview');//加载插件
  let globalCLIConfig = _configFiledConstant.getGlobal()
  let gitHash = _getGitHash()
  return _http.createServer(async (request, response)=>{
    showResponseTime(request, response)
    let requestData = parseURL(request.url)
    if(requestData.path == "/__health_check"){
      if(request.method == "GET"){
        let recordStatus =  ~~_fs.readFileSync("server-status.dat", "utf8")
        response.statusCode = recordStatus || 500;
        response.end()
        return
      }else if(request.method == "PUT"){
        let ip  = request.headers['x-forwarded-for'] || request.connection.remoteAddress
        //只允许本地更新的不允许远程更新状态
        if(ip.indexOf("127.0.0.1")!=-1 || ip =="::1"){
          let status = requestData.query["status"] || 200;
          _fs.writeFileSync("server-status.dat", status || 200, "utf8")
          response.end("更新当前系统状态为:"+status)
          response.end()
        }else{
          response.statusCode = 401
          response.end("不允许远程更新系统状态!!")
        }
        return
      }
    }

    //基本数据
    let req = {
      path:  requestData.path,
      query: requestData.query
    }
    let realPath = req.path;
    if(realPath == '/'){
      realPath = globalCLIConfig.index || "index.html"
    }
    let data:any = {
      status: 404,
      realPath: realPath,
      __gitHash: gitHash
    }
    let fetchDataStartTime = Date.now()
    await _hooks.triggerPreview('forward', req, data)
    console.log(`fetch Data use: ${Date.now()- fetchDataStartTime}ms`);
    let content = await _hooks.triggerPreview("compile", req, data)
    if(data.status == 404){
      response.statusCode = 404;
      response.end()
      return
    }
    response.setHeader('Content-Type', data.ContentType || _getMime(data.realPath))
    response.write(content, "utf8")
    response.end()
  })
}

if(require.main == module){
  require('colors');
  let port = _.indexOf(process.argv, "-p") > -1 ? process.argv[_.indexOf(process.argv, "-p") + 1] : 14488
  let workspace =  _.indexOf(process.argv, "-w") > -1 ? process.argv[_.indexOf(process.argv, "-w") + 1] : process.cwd()
  let enviroment =  _.indexOf(process.argv, "-e") > -1 ? process.argv[_.indexOf(process.argv, "-e") + 1] : "production"
  let viewDir =  _.indexOf(process.argv, "-v") > -1 ? process.argv[_.indexOf(process.argv, "-v") + 1] : "prebuild"
  let healthCheck = _.indexOf(process.argv, "-c") > -1 ? process.argv[_.indexOf(process.argv, "-c") + 1] : ""
  //读取用户自定义配置
  _init.prepareUserEnv(workspace);
  //读取运行时环境配置
  _init.prepareRuntimeEnv(enviroment || "production")
  _init.setRunType("preview")
  _configFiledConstant.setBuildParams({outdir: viewDir})
  let app = privewServer(healthCheck)
  console.log(`run on ${port} at ${workspace} as ${enviroment}`.green)
  app.listen(port)
}