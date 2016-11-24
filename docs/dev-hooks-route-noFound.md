### router  route:noFound

#该Hook 仅可以配置一个。

```js

exports.registerPlugin(cli, options)=>{
  /*
  *  cb: (hasProcess)=>{}     cb接收一个参数，如果该hook需要处理响应 这个404 那么传人 true， 如果要 交给默认处理器处理,那么传入false
  */
  cli.registerHook('route:notFound', (req, resp, cb)=>{
    resp.status = 404
    resp.send('can not found it')
    cb(true)
  })
}

```