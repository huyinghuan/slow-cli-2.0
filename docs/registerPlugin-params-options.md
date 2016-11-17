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

如果该插件的名字是 `plugin-demo`

那么`options`的值为上面的部分：

```js
{
  plugin-demo-params-xxx:xxx，
  ...
}
```