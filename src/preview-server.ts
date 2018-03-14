import * as _http from 'http';
import * as _async from 'async';
import * as _fs from 'fs';
import * as _path from 'path';

import * as _ from 'lodash';
import { CompilerCallBack } from './all';
import * as _hooks from './hooks/index';
import * as _hooksMap from './hooks/map';
import _getMime from './lib/getMime';
import _configFiledConstant from './config-filed-constant';
import * as _plugin from './plugin/index';
import _getGitHash from './lib/getGitHash'
import * as _init from './init/index'
import * as _httpUtils from './http-utils'

/**
 * 启动静态服务
 */
export function privewServer(){
  _plugin.scanPlugins('preview');//加载插件
  let globalCLIConfig = _configFiledConstant.getGlobal()
  let gitHash = _getGitHash()

  return _http.createServer(async (request, response)=>{
    _httpUtils.showResponseTime(request, response)
    let requestData = _httpUtils.parseURL(request.url)
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
  //读取用户自定义配置
  _init.prepareUserEnv(workspace);
  //读取运行时环境配置
  _init.prepareRuntimeEnv(enviroment || "production")
  _init.setRunType("preview")
  _configFiledConstant.setBuildParams({outdir: viewDir})
  let app = privewServer()
  console.log(`run on ${port} at ${workspace} as ${enviroment}`.green)
  app.listen(port)
}