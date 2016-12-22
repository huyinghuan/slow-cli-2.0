## commander start

启动静态服务器. e.g.

```shell
silky start -p 3002 -c
```

### 可选选项参数：

```shell
-p --port #指定运行端口
-c --check #检测运行版本，和插件版本
-e --enviroment #指定运行环境，使插件读取相应环境等配置 optional:【develop, production】
-l --log #见 command-common-params.md
-A --additional #见command-common-params.md
-n --noConfig  #无配置文件运行
```

### 查看选项帮助说明

```
silky start --help
```

你也可以通过修改过对应的配置文件项目目录下 `package.json`的部分内容来替换每次都需要进行的设置(有些选项无法在package.json进行设置)：

```js
{
  "xxx": "xxx",
  "silky":{
    "port": 14422, //对应 port
    "index": "index.html"
  }
}
```

