# 概述

该版本为`silky`重构版。 该工具静态服务器部分基于`expressjs`实现,  编译过程 采用hook形式，在处理文件的不同阶段调用不同的hook.

# 用户手册
## 安装
### 【芒果TV内部版本】
所有带`-g`参数的，linux或者mac请加 `sudo`

```
# 1. 确保npm 最新版本  npm --version  显示在3.x的可以忽略此步骤
npm update -g npm
# 2. 安装或者更新mgtv
#如果mac安装失败  请 
#sudo rm -rf /usr/local/lib/node_modules/.mgtv_npminstal
#sudo rm -rf /usr/local/bin/mgtv
#sudo rm -rf /usr/local/lib/node_modules/mgtv
npm uninstall -g mgtv
npm install -g mgtv  
# 3. 安装新版silky
mgtv -g install silky-reborn
# 4. 检查是否安装成功, 显示2.x.x版本及以上即安装完成
sr --version
```
### npm 公开版本

```
# 1. 确保npm 最新版本  npm --version  显示在3.x的可以忽略此步骤
npm update -g npm
# 3. 安装新版silky
npm -g install silky-reborn
# 4. 检查是否安装成功, 显示2.x.x版本及以上即安装完成
sr --version
```

## 启动命令及参数说明

### init

在一个空的文件夹中，需要建立一个silky项目，那么可以使用该命令进行初始化

启动静态服务器. e.g.

```shell
 sr init
```
或者根据示例项目初始化项目

```shell
sr init -p MGUI
#然后安装该项目的依赖
sr install 
```

### 可选选项参数：

```shell

-p --projectName #指定根据某个项目初始化本项目
-l --log #见 通用选项说明
-w --workspace #指定工作目录 可选，默认为当前目录
```

### 查看选项帮助说明

```
sr init --help
```


### start

启动静态服务器. e.g.

```shell
sr start -p 3002
```

#### 可选选项参数：

```shell
-p --port #指定运行端口
-c --check #检测运行版本，和插件版本
-e --enviroment #指定运行环境，使插件读取相应环境等配置 optional:【develop, production】
-l --log #见 command-common-params.md
-A --additional #见command-common-params.md
-n --noConfig  #无配置文件运行
-w --workspace #指定工作目录
```

#### 查看选项帮助说明

```
sr start --help
```

你也可以通过修改过对应的配置文件项目目录下 `package.json`的部分内容来替换每次都需要进行的设置(有些选项无法在package.json进行设置)：

```js
{
  "xxx": "xxx",
  "silky":{
    "port": 14422, //对应 port
    "index": "index.html", //首页
    "autoindex": "true" //是否展示目录
  }
}
```

### build

编译项目. e.g.:

```shell
 sr build -o ./build-test -f
```

#### 可选项参数：

```shell

#强制编译项目，当silky 版本，插件版本和 项目的package.json中所依赖的版本不同时，sr build会失败，这时需要使用-f参数
-f --force 
-o --outdir #输出路径 该参数不指定时，默认build到 ./build目录

-l --log  #见 command-common-params.md #

-w --workspace #指定工作目录 #默认为当前目录
-s --httpServer #以server形式运行 #本地开发不重要，一般服务器启动

-A --additional #见command-common-params.md #不重要，除非使用了特定插件，插件会进行说名
```

#### 查看选项帮助说明

```
sr build --help
```

你也可以通过修改过对应的配置文件项目目录下 `package.json`的部分内容来替换每次都需要进行的设置(有些选项无法在package.json进行设置)：

已存在值为默认值。

```js
{
  "xxx": "xxx",
  "silky-build": {
    "outdir": "./build", //默认输出目录 可以不用配置
     "ignore": ["node_modules", "(\\/\\.[^/]+)$"] // ==> new RegExp(ArrayItem) 默认忽略以 . 开始的文件名
  }
}

```

### install

安装项目插件 e.g.
安装指定插件:
```shell
 sr install sp-proxy sp-merge
```
或者
安装项目所有依赖的silky插件， ⚠️ `sr install` 仅安装`silky-plugin`里面配置的插件，`package.json`里面的`devDependencies`和`dependencies`不会安装的，这些配置还是需要用`npm`或者`mgtv`安装

```shell
sr install
```

#### 可选选项参数：

`-l --log` 详细见[common-command-common-params.md](common-command-common-params.md)
`-p --pluginListName` 根据插件列表名称获取插件列表
`-w --workspace` 指定工作目录
`-s, --save`, 以正式依赖安装插件，用于开发js css lib 库, 安装的插件会保存到`dependencies`里面
如果设置了`-p`,那么忽略其他安装选项。 如果指定了安装插件的具体名称，那么只安装指定插件， 如果既没有指定插件也没有制定插件列表名称，那么默认安装`silky-plugin`下配置的插件。

#### 查看选项帮助说明
```
sr init --help
```

### sync

同步项目配置文件 e.g.

```shell
 #下载本项目配置（读取package.json的name和version）
 sr sync
 #下载本项目某个版本配置
 sr sync -v 1.0.0
 #下载某个项目最后一个版本配置
 sr sync -n test
 #下载某个项目的某个配置的某个版本
 sr sync -n test -v 1.0.0
```

#### 可选选项参数：

```shell

-u --url 配置服务器地址 #可选
-w --workspace #可选 指定工作目录
-n, --projectName #可选 项目名字
-v, --version  #可选 项目版本
```

### up

上传项目配置文件 e.g.

```shell
 #上传项目配置文件(未指定版本时，读取package.json的version版本)
 sr up
 #上传项目配置文件到某个版本(未指定版本时，读取package.json的version版本)
 sr up -v 1.0.0
 #上传项目配置文件到某个名称下面(未指定版本时，读取package.json的version版本)
 sr up -n test
 #上传项目配置文件到某个名称下面的摸个版本
 sr config up -n test -v 1.0.0
```

## check

检查工具版本和插件版本 e.g.

```shell
 sr check
```

### 可选选项参数：

```shell
-l --log #见 command-common-params.md
-f --fix #修复silky 缺失的配置项，增加必备的文件夹, 安装缺失插件或者重新安装配置指定版本的插件
-w --workspace #指定工作目录
```

### 查看选项帮助说明

```
silky check --help
```

#### 可选选项参数：

```shell

-u --url 配置服务器地址
-w --workspace #指定工作目录
```

### 通用选项说明 start, build 等通用

#### -l, --log

log日志,打印silky运行时相关日志， 如果觉得信息过多可以使用该参数,

( 0[默认]: show all; 1: show error, fail; 2: show error, fail, warn)

```
-l 0 显示所有类型的log

-l 1 显示 error和fail

-l 2 显示 error ，fail， warn

```


#### -A, --additional 不重要

插件开发者灵活使用该参数。用户根据插件文档说明使用该参数

```shell
-A key=value[,key2=value2]
#增加的编译参数为
{
  key: value,
  key2: value2
}
```

额外的环境变量导入.

也可以使用

```shell
-A value

#得到的编译参数为 {extra: value}
```

## 配置文件

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
  ignore: ["node_modules", "(\\/\\.[^/]+)$"] //编译跳过这些文件。 适用正则表达式的字符串。 所有平台下（包含windows）,路径分割符在写正则时都使用 '/' 不使用 '\'
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

## 常用插件


[插件仓库](https://github.com/silky-plugin)

常用插件说明
  - [sp-hbs hbs处理](https://github.com/silky-plugin/sp-hbs)
  - [sp-less less处理](https://github.com/silky-plugin/sp-less)
  - [sp-proxy http代理，避免跨域开发](https://github.com/silky-plugin/sp-proxy)
  - [sp-coffee coffee支持](https://github.com/silky-plugin/sp-coffee)
  - [sp-mini 文件压缩](https://github.com/silky-plugin/sp-mini)
  - [sp-merge-in-html 文件合并](https://github.com/silky-plugin/sp-merge-in-html)

## LICENSE

MIT