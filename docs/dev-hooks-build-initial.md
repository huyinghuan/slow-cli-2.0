### build:initial

全局接管编译系统

```js
//hooks demo 如下

const priority = 1;

/**
*cli 见文档 (registerPlugin 中 cli 参数说明)[docs/registerHook-params-cli.md]
*options 见文档 (registerPlugin 中 options 参数说明)[docs/registerHook-params-options.md]
*/
exports.registerPlugin = (cli, options)=>{
  
  //cb callback.   (error, stop)
  // stop true 停止其他插件的编译介入， false， 其他编译插件继续
  cli.registerHook('build:initial', (cb)=>{
    cb(null, false)
  }, priority) //权重，默认为1， 越小排越前，可以忽略
}

```