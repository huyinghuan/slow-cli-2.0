# 开发者手册

## 以http方式唤起 build 工作

### 编译项目
```
 path: /all
 method: get
 query:  outdir  输出编译后的文件夹位置，必须指定

 return
   response code 200 编译完成
   response code 非200 编译错误
```

### 编译某个页面

```
  path: /sigle
  method: get
  query:  
    filepath 需要编译等页面路径  必须   
    outdir 输出文件夹位置 必须

  return
   response code 200 编译完成
   response code 非200 编译错误
```


### 重新加载插件【当项目的插件有更新时】

```
  path: /reloadHooks
  method: get
  return 
    response code 200 加载插件成功
    response code 非200 加载插件失败，或者校验插件失败
```


## 插件接口标准

1. 所有插件必须实现

```js
//这个插件 一般使用这个
exports.registerPlugin((cli, options)=>{})

或
//这个是插件扩展， 这个一般用户hbs的helper注册
exports.registerPluginExt((cli, options)=>{})

```
其中
[params cli](./docs/dev-registerPlugin-params-cli.md), [params options](./docs/dev-registerPlugin-params-options.md)


其他相关 [dev-plugin.md](./docs/dev-plugin.md), 插件扩展 [dev-registerPluginExt.md](./docs/dev-registerPluginExt.md)


2. 所有插件必须包含`README.md`,告知使用方式。



## silky start 插件开发【route hook】

### Hook 触发顺序

```js

route:initial -> route:didRequest ->  route:willResponse -> ?route:notFound -> route:didResponse

```

[route:initial](./docs/dev-hooks-route-initial.md)

[route:didRequest](./docs/dev-hooks-route-didRequest.md)

[route:willResponse](./docs/dev-hooks-route-willResponse.md)

[route:noFound](./docs/dev-hooks-route-noFound.md)

[route:didResponse](./docs/dev-hooks-route-didResponse.md)

### Hook 重要参数说明。

#### data
`route:didRequest`， `route:willResponse`中的data参数 ，初始化时：

```
{
  status: 404,  #用于标示 是否经过编译器处理 200 已经过编译
  realPath: pathname #用于代替 req.path。  主要是 将  path == '/'  替换为 配置的 silky.index.  没有默认为 index.html
}
```

## silky build 插件开发 【build hook】

### 触发顺序

```js

build:initial > build:willBuild >  build:doCompile > build:didCompile >  ?build:doNothing > build:end

----------------------- 以上任意一个步骤发生错误将触发[build:error] -----------------------

```


[build:initial](./docs/dev-hooks-build-initial.md)

[build:willBuild](./docs/dev-hooks-build-willBuild.md)

[build:doCompile](./docs/dev-hooks-build-doCompile.md)

[build:didCompile](./docs/dev-hooks-build-didCompile.md)

[build:doNothing](./docs/dev-hooks-build-doNothing.md)

[build:end](./docs/dev-hooks-build-end.md)

## 插件列表

更多示例可参考 [官方插件](https://github.com/silky-plugin)