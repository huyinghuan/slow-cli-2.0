## 启动参数说明

For User

## init

初始化项目

```shell

-p --pluginListName #制定插件列表名称，从而获取插件列表

```

## start

启动静态服务器

```shell

-p --port #指定运行端口

-c --check #检测运行版本，和插件版本
```

对应的配置文件：package.json

```
xxx:xxx
silky:{
  port: 14422,
  index: 'index.html'
}
```

## build

编译项目

```shell

-f --force #强制编译项目，哪怕工具版本，插件版本和依赖不同

-o --outdir #输出路径

```

对应的配置文件：package.json
已存在值为默认值。

```json
xxx:xxx
silky-build:{
  outdir: './build', //默认输出目录 
  // fileInclude > folderExclude > fileExclude
  folderExclude: ['node_modules']  //support regexp string.  default
  fileExclude: ["^\\."],
  fileInclude: [], //support regexp string
}
```


## check

检查工具版本和插件版本

