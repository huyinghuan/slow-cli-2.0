import * as _express from 'express';
import * as _http from 'http';
import * as _colors from 'colors';
import * as _hooks from './hooks/index';
import _hooksMap from './hooks/map';


const startServer = function(app:any, cli:any, router:_express.Router){
  //let app = _express();
  app.use(router)
  let _server = _http.createServer(app)

  _server.on('error', (error) => {
    if((error as any).code == 'EADDRINUSE'){
      console.log("端口冲突，请使用其它端口".red);
      return process.exit(1)
    }
    console.log(error)
  });
  console.log(`server listen at port ${cli.port}`.green)
  _server.listen(app.listen(cli.port));
  
}


/**
 * 启动静态服务
 */
export default ()=>{
  let cli = (global as any).__CLI;
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
        case 200:
        case 304 : console.log(msg); break;
        case 401:
        case 403:
        case 404:
        case 500:  console.log(msg.red); break;
        default:
          console.log(msg.gray);
      }
    })
    next()
  });

  //启动服务器之前
  //_hooksMap.route.initial
  if(_hooks.triggerRouterHook(router)){
    return;
  }
  //需要出发其他
  startServer(app, cli, router)
}