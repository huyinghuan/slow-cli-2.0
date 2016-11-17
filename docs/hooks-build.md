## BUILD-HOOKS

### 触发顺序

```js

build:initial > build:willBuild >  build:doCompile > build:didCompile > build:didBuild > ?build:doNothing > build:end

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

即将要编译了。可以增加更多的编译参数或者修改编译参数


```js

export.registerPlugin = (cli, options)=>{
  //buildConfig 编译参数。 具体查看  [docs/command]
  //cb [error, buildConfig]
  cli.registerHook('build:willBuild', (buildConfig, cb)=>{
    buildConfig.test = "xxx";
    console.log("build will do 2: ", buildConfig)
    cb(null, buildConfig)
  }, 1)
}

```

### build:doCompile

编译文件

```js
export.registerPlugin = (cli, options)=>{

  /*
  Params: 
    data: {
      inputFilePath:
      outputFilePath:
      fileName
    }
    content 编译文件内容

    这中间 data 还可能被赋予其他值：
      status: 200 编译成功。 没有该值则认为编译失败
    
    编译完成后记得修改实际输出文件名
      data.outputFilePath = xxx;
  */

  cli.registerHook('build:doCompile', (data, content, cb)=>{
    cb(error, data, content)
  })
}

```

### build:didCompile

加工编译内容


```js
export.registerPlugin = (cli, options)=>{

  /*
  Params: 
    data: {
      inputFilePath:
      outputFilePath:
      fileName
    }
    content 编译文件内容

    这中间 data 还可能被赋予其他值：
      status: 200 编译成功。 没有该值则认为编译失败
    
    编译完成后记得修改实际输出文件名
      data.outputFilePath = xxx;
  */

  cli.registerHook('build:didCompile', (data, content, cb)=>{
    cb(error, data, content)
  })
}

```