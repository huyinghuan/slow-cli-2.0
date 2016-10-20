## HOOKS

### route:initial

静态服务启动前的hooks。

```js
//hooks定义如下

export.plugin = (cli, cb)=>{
  //router: express.IRouter
  //cb: function(stop){} //stop false时 启动静态服务器， 为true时，不启用
  cli.registerHook('route:initial', (router, cb)=>{
    cb(stop)

  })
}

export.priority = 1  //权重，默认为1， 越大排越前，可以忽略

```