### build:serverFilter

编译功能作为http服务启动时，拦截编译请求。

可用场景：

  严重编译请求是否合法

```js
//hooks demo 如下

const priority = 1;

/**
*cli {registerHook:registerHook, options: global.__CLI 【全局配置】}
*options 插件配置
*/
exports.registerPlugin = (cli, options)=>{
  //router: express.IRouter
  //return stop[boolean].  true 启动静态服务器，完全接管silky，弃用其他插件。  为false时，作为中间件存在, 默认为false

  cli.registerHook('build:filter', (router)=>{
    // 完全接管
    router.get('/all', function(req, resp, next){
        if(req.headers.private_token !== "abc"){

        }
        //resp.send(..)
    });
  }, priority) //权重，默认为1， 越小排越前，可以忽略
}

```