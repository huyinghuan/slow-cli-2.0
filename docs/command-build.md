
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