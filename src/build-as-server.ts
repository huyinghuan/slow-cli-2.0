import * as _express from 'express';
import * as _http from 'http';
import * as _hook from './hooks/index';
import * as _plugin from './plugin/index';
import * as _hookMap from './hooks/map';
import _log from './lib/log';
import * as _build from './build';
import * as _path from 'path';
import * as _init from './init/index';
import * as _fse from 'fs-extra';

const startBuildServer = (port)=>{
  let app = _express()
  let router = _express.Router();

  router.all('*', (req, resp, next)=>{
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

  //编译所有
  router.get('/all', (req, resp)=>{
    let outdir = req.query.outdir;
    if(!outdir){
      resp.status(403);
      resp.send({error: "未指定编译路径"})
      return
    }
    if(!_path.isAbsolute(outdir)){
      resp.status(403);
      resp.send({error:"路径不正确"})
      return
    };
    try{
      _fse.ensureDirSync(outdir)
    }catch(e){
      resp.status(403)
      resp.send({error:"目录不可创建"})
      return
    }
    let buildConfig = _init.getBuildConfig();
    buildConfig.outdir = outdir;
    _build.normalExecute(buildConfig, (error)=>{
      if(error){
        console.log(error)
        resp.status(500);
        resp.send({msg: "编译失败！"})
      }else{
        resp.status(200);
        console.log(`编译完成`)
        resp.send({msg: "编译成功！"})
      }
    })
  })
  app.use(router)

  let _server = _http.createServer(app)
  _log.info(`Build Server listen at port ${port}`.green)
  _server.listen(app.listen(port));
}

export default function(port){
  //加载插件
  _plugin.scanPlugins('build');

  startBuildServer(port)
}