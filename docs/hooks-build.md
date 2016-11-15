## BUILD-HOOKS

### 触发顺序

```js

build:initial > build:willBuild >  build:doCompile > build:didCompile > build:didBuild > build:end

```

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

### build:willBuild

即将要编译了。可以增加更多的编译数据或者修改编译数据


```js

export.registerPlugin = (cli, options)=>{
  
  //build 编译参数。 具体查看  [docs/command]
  // stop true 停止其他插件的编译介入， false， 其他编译插件继续
  cli.registerHook('build:willBuild', (buildConfig, cb)=>{
    
    buildConfig.test = "xxx";
    console.log("build will do 2: ", buildConfig)
    cb(null, buildConfig)
  }, 1)
}

```