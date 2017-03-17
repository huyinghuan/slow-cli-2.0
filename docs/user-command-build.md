
## command build

编译项目. e.g.:

```shell
 silky build -o ./build-test -f
```

### 可选选项参数：

```shell

-f --force #强制编译项目，哪怕工具版本，插件版本和依赖不同

-o --outdir #输出路径

-l --log #见 command-common-params.md
-A --additional #见command-common-params.md
-w --workspace #指定工作目录
-s --httpServer #以server形式运行
```

### 查看选项帮助说明

```
silky build --help
```

你也可以通过修改过对应的配置文件项目目录下 `package.json`的部分内容来替换每次都需要进行的设置(有些选项无法在package.json进行设置)：

已存在值为默认值。

```js
{
  "xxx": "xxx",
  "silky-build": {
    "outdir": "./build", //默认输出目录
   "ignore": ["node_modules", "(\\/\\.[^/]+)$"] // ==> new RegExp(ArrayItem)
  }
}

```

### 以server形式运行build时，提供以下接口:

#### 编译项目
```
 path: /all
 method: get
 query:  outdir  输出编译后的文件夹位置，必须指定

 return
   response code 200 编译完成
   response code 非200 编译错误
```

#### 编译某个页面

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


#### 重新加载插件【当项目的插件有更新时】

```
  path: /reloadHooks
  method: get
  return 
    response code 200 加载插件成功
    response code 非200 加载插件失败，或者校验插件失败
```
