## 全局变量

获取方式：
```
require('./config-filed-constant').get()
```

```js
{
  index: 'index.html', //start server 默认首页
  port: '14422'
  pluginConfig:{
    xxx:xxx
  }
  buildConfig:{
    outdir: './build', //在检查完编译参数后，将会变成绝对路径
    ignore: ['node_modules', "^(\\.)"],
    outRelativeDir: './build' ////在检查完编译参数后 自动添加
    gitHash: "xxx" //如果当前项目是git项目，且有一次提交，那么该值为当前commit的hash,如果非git项目，或者没有commit该值为null
  },
  enviroment: "",
  enviromentDir: ""
}
```