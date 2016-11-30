## HBS编译

### 数据处理

0. 查看插件配置

```
{
  "sp-hbs":{
    data-config: "demo.js"
  }
}
```

读取`data-config`在运行时的配置数值`demo.js`，【例如：运行时环境为`production` 先读`production/demo.js`, 在看`normal/demo.js`, 然后 `normal`继承`production`】 如果没有指定该配置则默认数值为`{}`

1. 查看配置`demo.js` 里的 `data-map`字段， 如果没有，则  `data-map`设置为 `{}`


2. 读取 `dataMap` 里面该路径是否对应了 `数据地址`, 如果有数据路径，那么查看是否配置了`baseUrl`,如果配置了，那么该数据路径将加上`baseUrl`
 
(以`http://` 或者 `https://` 开始读取url数据，路径则 读取相应运行时环境下的`json`或`js`文件）

3. 如果第二步没有配置该文件对应的 数据选项，那么进入 `步骤4`

4.  分析文件内容。 读取文件里面的配置.

```hbs
{{!-- PAGE_DATA: hello --}}
```

或

```hbs
{{!-- PAGE_DATA: {{main}}hello --}}
```

查看 `data-config`在运行时的配置数值`demo.js`， 如果没有指定该配置则默认数值为`{}`

使用`demo.js`里面的`urlMap`字段 编译 `PGAE_DATA:`后面的值， 如果得到的数据地址 以`http://` 或者 `https://` 开始读取url数据，路径则 读取相应运行时环境下的`json`或`js`文件

如果`404`，或未找到对应的`js`或`json`,那么抛出 `Error`.

5. 若文中不含配置，那么不使用数据编译。

### 页面数据配置 demo

`data-config:demo.js`:

```js

module.exports = {
  "cache": true
  "dataMap": {

  },
  "urlMap":{
    main: baseUrl
  },
  //提供http head头，用于一些接口校验
  headers:{

  }
}
```


