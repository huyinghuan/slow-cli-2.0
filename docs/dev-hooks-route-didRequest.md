### router: route:didRequest

server接收到http服务后的处理流程。
主要用于： 
1. 编译 hbs， less, sass等。
2. 压缩编译后文件内容， min js， min css 等。
3. 响应内容到浏览器

```js
const priority = 1;

exports.registerPlugin = (cli, options)=>{
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