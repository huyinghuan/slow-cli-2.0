## ROUTE-HOOKS

### 触发顺序

```js

route:initial > route:didRequest >  route:willResponse > ?route:notFound > route:didResponse

```

### Hook 重要参数说明。

#### data
`route:didRequest`， `route:willResponse`中的data参数 ，初始化时：

```
{
  status: 404,  #用于标示 是否经过编译器处理 200 已经过编译
  realPath: pathname #用于代替 req.path。  主要是 将  path == '/'  替换为 配置的 silky.index.  没有默认为 index.html
}
```


