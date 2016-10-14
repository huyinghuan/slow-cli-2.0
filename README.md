## HOOKS

### route:initial

静态服务启动前的hooks。

```js
//hooks定义如下

module.export = (cli, cb)=>{
  //router: express.IRouter
  //cb: function(stop){} //stop false时 启动静态服务器， 为true时，不启用
  cli.registerHook('route:initial', (router, cb)=>{
    cb(stop)

  })
}

```