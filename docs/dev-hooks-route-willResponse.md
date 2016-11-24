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
exports.registerPlugin(cli, options)=>{
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