## command install

安装项目插件 e.g.

```shell
 silky install sp-proxy sp-merge
```

### 可选选项参数：

`-l --log` 详细见[common-command-common-params.md](common-command-common-params.md)
`-p --pluginListName` 根据插件列表名称获取插件列表
`-w --workspace` 指定工作目录
`-s, --save`, 以正式依赖安装插件，用于开发js css lib 库, 安装的插件会保存到`dependencies`里面
如果设置了`-p`,那么忽略其他安装选项。 如果指定了安装插件的具体名称，那么只安装指定插件， 如果既没有指定插件也没有制定插件列表名称，那么默认安装`silky-plugin`下配置的插件。

### 查看选项帮助说明
```
silky init --help
```
