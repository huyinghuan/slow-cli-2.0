##

## Register Hooks

```
exports.registerPlugin = (cli, options)=>{
  cli.registerHook(hookName, hookFn)
}
```

## Hooks
request，response 经过hook的顺序如下

###  route:initial    

```
# async function(request, response){ return boolen } 
# if true，  请求停留在这里，不会在继续往后走
# if false            -->
```

### route:dir 

```
async function(dirpath, data)

data.fileArray为数组 在里面增加对象即可显示该文件在文件目录中（也可以修改fileArray里面元素字段），属性如下：

data.fileArray.push({
  href: _path.dirname(path), #点击文件路径 跳转的地址 【可以用于.hsb, .es6等扩展,显示.hbs,跳转到.html】
  path: _path.dirname(path), #真实到文件路径（可供插件使用）
  filename: "xxx",  文件名
  isDir: true 是否为文件夹
})
```


### rout:forward 
```
async function(req, data)
#其中:
req = {
  path:  url path
  query: url query
  __request:  http 原生 request
}

data = {
  status: 状态码  默认404
  realPath: realPath 实际请求路径， 如 /  根据配置变成 /index.html， 通过修改该值，可以修改实际访问文件。
}
```


### route:didRequest  一般文件编译，在此hooks，如hbs，coffee, es6, less等

```
async function(req, data, content){return content}
# Params:

req = {
  path:  url path
  query: url query
  __request:  http 原生 request
}

data = {
  status: 状态码  默认404  如果处理这次请求，并且有内容返回，这里需要设置为 200
  realPath: realPath 实际请求路径， 如 /  根据配置变成 /index.html， 通过修改该值，可以修改实际访问文件。
}

content

当前请求经由其他hook处理过后的内容。第一个处理该请求的hook获取的content为null

# Return
将该hook处理后【或者忽略不用处理的】的content 返回

```

### route:willResponse 一般文件处理在此hook，如修改html里面的href, 压缩，等

```
async function(req, data, content){return content}
# Params:

req = {
  path:  url path
  query: url query
  __request:  http 原生 request
}

data = {
  status: 状态码  默认404  如果处理这次请求，并且有内容返回，这里需要设置为 200
  realPath: realPath 实际请求路径， 如 /  根据配置变成 /index.html， 通过修改该值，可以修改实际访问文件。
}

content
准备响应的content

# Return
将该hook处理后【或者忽略不用处理的】的content 返回
```




