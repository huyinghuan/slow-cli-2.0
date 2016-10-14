import * as _express from 'express';
import * as _http from 'http';
import * as _colors from 'colors';
import * as _hooks from './hooks/index';
import _hooksMap from './hooks/map';

const startServer = function(cli:any){
  let app = _express();
  let router = app.route

  let _server = _http.createServer(app)

  _server.on('error', (error) => {
    if((error as any).code == 'EADDRINUSE'){
      console.log("端口冲突，请使用其它端口".red);
      return process.exit(1)
    }
    console.log(error)
  })
  _server.listen(app.listen(3000));
}


/**
 * 启动静态服务
 */
export = (cli:any)=>{
  let app = _express();
  let router = _express.Router();

  //启动服务器之前
  //_hooksMap.route.initial
  _hooks.triggerRouterHook(router, (stop)=>{
      if(stop){
        return
      }
      startServer(cli)
  })
}








