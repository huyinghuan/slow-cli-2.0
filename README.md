## HOOKS

### route:initial

静态服务启动前的hooks。 

可用场景：

1. 增加代理路径， 讲一些接口访问 代理到其他 服务端， 避免跨域问题。

2. 完全接管silky服务， silky 其他任何插件都不会再执行其它插件。

```js
//hooks demo 如下

const priority = 1;

/**
*cli {registerHook:registerHook, __CLI: global.__CLI 【全局配置】}
*options 插件配置
*/
export.registerPlugin = (cli, options)=>{
  //router: express.IRouter
  //return stop[boolean].  true 启动静态服务器，完全接管silky，弃用其他插件。  为false时，作为中间件存在, 默认为false

  cli.registerHook('route:initial', (router)=>{
    // 完全接管
    router.get('/toAnotherServer', function(req, resp, next){
        //resp.send(..)
    });
    router.get('/xxx', function(xx,xxx,xx){})
    return true

    //只是対该路径进行拦截，作为中间件存在。
    route.get('/a.hbs', function(req, resp, next){
        //xxx
        next()
    })
    return false
  }, priority) //权重，默认为1， 越大排越前，可以忽略
}


```