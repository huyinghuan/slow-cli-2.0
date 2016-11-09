## BUILD-HOOKS

### build:initial

全局接管编译系统

```js
//hooks demo 如下

const priority = 1;

/**
*cli {registerHook:registerHook, __CLI: global.__CLI 【全局配置】}
*options 插件配置
*/
export.registerPlugin = (cli, options)=>{
  
  //cb callback.   (error, stop)
  // stop true 停止其他插件的编译介入， false， 其他编译插件继续
  cli.registerHook('build:initial', (cb)=>{
    cb(null, false)
  }, priority) //权重，默认为1， 越大排越前，可以忽略
}

```
