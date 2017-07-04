import * as _express from 'express';
import * as _http from 'http';
import * as _path from 'path';
import * as _hook from '../hooks/index';
import * as _plugin from '../plugin/index';
import * as _hookMap from '../hooks/map';
import _log from '../lib/log';

import _configFiledConstant from '../config-filed-constant';
import * as _fse from 'fs-extra';
import * as _async from 'async';
import _getGitHash from '../lib/getGitHash';
import _executeProjectCompile from './executeProjectCompile'
import _excuteFileCompile from './excuteFileCompile'
import _unregisterHooks from '../hooks/unregisterHooks'

const buildServer = function(prepareFn:Function):_express.Express{
  let app = _express()
  let router = _express.Router();

  router.all(/^\/((single)|(all)).?/, (req, resp, next)=>{
    //挂载时间点
    (req as any).__acceptTime = Date.now();
    //显示请求耗费时间
    resp.on('finish', ()=>{
      let startTime = (req as any).__acceptTime;
      let spellTime = new Date().getTime() - startTime
      console.log(`编译耗时:${spellTime}`)
    })
    next()
  })

  //主要做一些接口认证的事
  _hook.triggerBuildServerFilterHook(router)

  router.get(/^\/((single)|(all)).?/, (req, resp, next)=>{
    let outdir = req.query.outdir;
    if(!outdir){
      resp.status(403);
      resp.send({error: "未指定编译路径"})
      return
    }
    if(!_path.isAbsolute(outdir)){
      resp.status(403);
      resp.send({error:"输出路径不正确"})
      return
    };
    try{
      _fse.ensureDirSync(outdir)
    }catch(e){
      resp.status(403)
      resp.send({error:"目录不可创建"})
      return
    }
    next()
  })

  router.get('/single', (req, resp)=>{

    let filepath = req.query.filepath;
    let outdir = req.query.outdir;

    if(!filepath){
      resp.status(403)
      return resp.send({msg: "缺少查询参数"})
    }

    let queue = [];
    queue.push((next)=>{
      _getGitHash(next)
    })

    queue.push((gitHash, next)=>{
      let buildConfig = _configFiledConstant.getBuildConfig({
        gitHash:gitHash,
        outdir: outdir,
        __extra: [],//额外需要编译的文件
        __del: [] //编译完成后需要删除掉冗余文件
      });
      _excuteFileCompile(buildConfig, filepath, next)
    })

    _async.waterfall(queue, (error)=>{
      if(error){
        console.log(error);
        resp.status(500)
        resp.send({msg: "编译错误"})
      }else{
        resp.sendStatus(200)
      }
    })
  });

  router.get('/reloadHooks', (req, resp, next)=>{
    prepareFn((hassError)=>{
      if(hassError){
        resp.status(500)
        return resp.send({error: "初始化环境失败"})
      }else{
        _unregisterHooks();
        _plugin.scanPlugins('build');
        resp.sendStatus(200)
      }
    })    
  })

  //编译所有
  router.get('/all', (req, resp)=>{
    let outdir = req.query.outdir;

    let queue = [];
    queue.push((next)=>{
      _getGitHash(next)
    })

    queue.push((gitHash, next)=>{
      let buildConfig = _configFiledConstant.getBuildConfig({
        gitHash:gitHash,
        outdir: outdir
      });
      _executeProjectCompile(buildConfig, next)
    })

    _async.waterfall(queue, (error)=>{
      if(error){
        console.log(error)
        resp.status(500);
        resp.send({msg: "编译失败！"})
      }else{
        resp.status(200);
        console.log(`编译完成`)
        resp.send({msg: "编译成功！", time: Date.now() - (req as any).__acceptTime})
      }
    })
  })
  app.use(router)

  return app
}

export default function(prepareFn:Function):_express.Express{
  prepareFn((hasError)=>{if(hasError){process.exit(1)}})
  //加载插件
  _plugin.scanPlugins('build');
  _hook.triggerBuildInitHook((error, stop)=>{
    if(error){
      _log.error(error)
      process.exit(1)
      return
    }
    if(stop){
      _log.info(`该项目已被插件接管编译功能，编译服务不适用于该项目`)
      process.exit(0)
      return
    }
  })
  return buildServer(prepareFn)
}