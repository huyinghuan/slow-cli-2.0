## 插件命名

所有插件的node_modules包必须以 `sp-`开头(意为silky-plugin)
所有插件扩展必须以 `sp-` 开始，以  `-ext` 结尾。

插件配置 额外配置可以通过`__propsXX` 双下划线开头的字段来配置， 如

```
"silky-plugin": {
  __root:xxx,
  plugin-A: {
    __source:xxx
  }
}
```

### __root

用来指定开发状态的插件的根目录。默认为 `process.cwd()`

插件实际读取路径为 `path.join((__root || process.cwd()), (plugin-A).__source)`


