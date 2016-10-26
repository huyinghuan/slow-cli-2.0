import * as _express from 'express';
import * as _http from 'http';
import * as _colors from 'colors';
import * as _hooks from './hooks/index';
import _hooksMap from './hooks/map';


const startServer = function(cli:any, router:_express.Router){
  let app = _express();
  app.use(router)

  let _server = _http.createServer(app)

  _server.on('error', (error) => {
    if((error as any).code == 'EADDRINUSE'){
      console.log("端口冲突，请使用其它端口".red);
      return process.exit(1)
    }
    console.log(error)
  })
  _server.listen(app.listen(cli.port));
}


/**
 * 启动静态服务
 */
export default (cli:any)=>{
  let app = _express();
  let router = _express.Router();
  //增加一些基础信息
  router.all('*', function(req, resp, next){
    //挂载时间点
    (req as any).__acceptTime = Date.now();

    //显示请求耗费时间
    resp.on('finish', ()=>{
      let startTime = (req as any).__acceptTime;
      let spellTime = new Date().getTime() - startTime
      let msg = `( ${req.url} ) : ${spellTime} ms : [${resp.statusCode}]`
      
      switch(resp.statusCode){
        case 200, 304 : console.log(msg);
        case 401, 403, 404, 500:  console.error(msg)
        default:
          console.log(msg);
      }
    })
  });

  //启动服务器之前
  //_hooksMap.route.initial
  _hooks.triggerRouterHook(router, (stop)=>{
      if(stop){
        app.use(router)
        return;
      }
      startServer(cli, router)
  })
}