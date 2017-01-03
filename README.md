# 概述

该版本为`silky`重构版。 该工具静态服务器部分基于`expressjs`实现,  编译过程 采用hook形式，在处理文件的不同阶段调用不同的hook.

# 用户手册

## 安装

## 启动命令及参数说明

[silky start](docs/user-command-start.md)

[silky build](docs/user-command-build.md)

[silky init](docs/user-command-init.md)

[silky check](docs/user-command-check.md)

[silky install](docs/user-command-install.md)

[silky config](docs/user-command-config.md)

## 配置文件可配置项

配置文件： package.json

for [silky start](docs/user-command-start.md)

```js
...
silky:{
  index: 'index.html', //start server 默认首页  url / === silky.index
  port: '14422' // 默认端口， 和 silky start -p 作用相同， -p 优先于这个配置
}
...
```

for [silky build](docs/user-command-build.md)

```js
...
silky-build:{
  outdir: './build', //配置编译文件输出目录，⚠️ 注意 ⚠️ build之前会先清空该文件夹。
  ignore: ["node_modules", "(\\/\\.[^/]+)$"] //编译跳过这些文件。 适用正则表达式的字符串
}
...
```

for [silky install](docs/user-command-install.md)

```js
...
silky-plugin:{
  pluginName: pluginSetting(Object) // or false[禁用] 具体配置见插件README.md
}
...
```

# 开发者手册

## 插件接口标准

1. 所有插件必须实现

```js

exports.registerPlugin((cli, options)=>{})

或

exports.registerPluginExt((cli, options)=>{})

```
其中
[params cli](docs/dev-registerPlugin-params-cli.md), [params options](docs/dev-registerPlugin-params-options.md)


其他相关 [dev-plugin.md](docs/dev-plugin.md), 插件扩展 [dev-registerPluginExt.md](docs/dev-registerPluginExt.md)


2. 所有插件必须包含`README.md`,告知使用方式。



## silky start 插件开发【route hook】

### Hook 触发顺序

```js

route:initial -> route:didRequest ->  route:willResponse -> ?route:notFound -> route:didResponse

```

[route:initial](docs/dev-hooks-route-initial.md)

[route:didRequest](docs/dev-hooks-route-didRequest.md)

[route:willResponse](docs/dev-hooks-route-willResponse.md)

[route:noFound](docs/dev-hooks-route-noFound.md)

[route:didResponse](docs/dev-hooks-route-didResponse.md)

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


[build:initial](docs/dev-hooks-build-initial.md)

[build:willBuild](docs/dev-hooks-build-willBuild.md)

[build:doCompile](docs/dev-hooks-build-doCompile.md)

[build:didCompile](docs/dev-hooks-build-didCompile.md)

[build:doNothing](docs/dev-hooks-build-doNothing.md)

[build:end](docs/dev-hooks-build-end.md)

## 插件列表

更多示例可参考 [官方插件](https://github.com/silky-plugin)


## 更新

v2.0.5 支持文件夹文件显示