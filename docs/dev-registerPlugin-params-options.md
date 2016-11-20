## registerPlugin 中 options 参数说明


项目目录下的 package.json：

```js
{
  silky-plugin:{

    plugin-demo:{
      plugin-demo-params-xxx:xxx，
      ...
    }
  }
}
```

如果该插件的名字是 `plugin-demo` ,那么`options`的值为上面的部分：

```js
{
  plugin-demo-params-xxx:xxx，
  ...
}
```

### 开发者注意！！！

在开发过程中,可以使用`__source`来指定插件实际目录(用绝对路径或者相对路径(相对路径))， `__setting`来配置插件需要的参数, `__stop`来停用或启用改插件
例如：

```js

{
  devPluginA:{
    __source: "xxxx",
    __setting: {
      configA: xxx,
      ...
    },
  }
}

```

但在用户使用时，因为用户不用 设置插件目录，为避免配置字段冗余用户实际填写的是：

```js
{
  devPluginA:{
    configA: xxx,
    ...
  }
}
```

也就是说`registerPlugin` 的参数 `options`  在开发状态[即存在`__source`时] 为 `devPluginA.__setting`，在正式使用状态[即`__source`字段不存在时] 为 `devPluginA`

因此插件需要用户配置的属性中，最好不要存在`__source`字段