## global.__CLI

```js
{
  index: 'index.html', //start server 默认首页
  port: '14422'
  pluginConfig:{

  }
}
```

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
    //====================== OR =====================//
    //只是対该路径进行拦截，作为中间件存在。
    route.get('/a.hbs', function(req, resp, next){
        //xxx
        next()
    })
    return false
  }, priority) //权重，默认为1， 越大排越前，可以忽略
}

```


### router: route:didRequest

server接收到http服务后的处理流程。
主要用于： 
1. 编译 hbs， less, sass等。
2. 压缩编译后文件内容， min js， min css 等。
3. 响应内容到浏览器

```js
const priority = 1;

export.registerPlugin = (cli, options)=>{
  /**
  *req:   http request
  *data: {status: int, realPath: string} status:  200 正常，404，未找到文件. 另外该编译器向下一个编译传递的数据可以存在这个里面. 详情见 hook data参数说明。
  *content: 上一个编译器过来的内容
  * cb:  回调函数。 必须传递三个参数，分别是 error, data, content
  * 其中
      * error:object, 仅当发生编译错误时， error赋值错误信息，否则为null传入。
      * data:JSONObject，当编译顺利完成时，可以使 data.status = 200, 如果编译的文件不存在，可以使 data.status = 404， 除此之外可以携带其他信息在其他字段. 
      * content:string， 编译完成后的，文件内容
  */
  cli.registerHook('route:didRequest', (req, data, content, cb)=>{

    //cb(error, data, responseContent)
  }, priority)
}
```

### router  route:willResponse

该hook一般用来处理文件编译完成后的，再次加工，如mini, autoprefix等。

```js
/**
  req:  Express.Request
  data: 经过route:didRequest Hook 传过来的参数，用来判断是否经过了编译器处理
  responseContent:  string  文件编译完成后的内容
  cb，回调函数， 必须传入error，和 processContent
  其中 processContent 为处理后的内容。 如果该hook不需要対传入的responseContent进行处理，那么将responseContent传回即可
*/
export.registerPlugin(cli, options)=>{
  cli.registerHook('route:willResponse', (req, data, responseContent, cb)=>{
    //如果没有经过编译器处理则不处理条请求
    if(data.status != 200){
      return cb(null, responseContent)
    }
    //该处举例不够严谨，仅用于表达意思
    if(req.path.indexOf('.css') == -1){
      return cb(error, responseContent)
    }
    let processContent =  xxxClean(responseContent)
    cb(null, processContent)
  }, priority)
}

```

### Hook 重要参数说明。

#### data
`route:didRequest`， `route:willResponse`中的data参数 ，初始化时：

```
{
  status: 404,  #用于标示 是否经过编译器处理
  realPath: pathname #用于代替 req.path。  主要是 将  path == '/'  替换为 配置的 silky.index.  没有默认为 index.html
}
```


### router  route:noFound

#该Hook 仅可以配置一个。

```js

export.registerPlugin(cli, options)=>{
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