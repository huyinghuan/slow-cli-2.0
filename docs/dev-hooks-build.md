## BUILD-HOOKS

### 触发顺序

```js

build:initial > build:willBuild >  build:doCompile > build:didCompile >  ?build:doNothing > build:didBuild > build:end

----------------------- 以上任意一个步骤发生错误将处罚 [build:error] -----------------------

```

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

### build:willBuild

即将要编译了。可以增加更多的编译参数或者修改编译参数

```js

expors.registerPlugin = (cli, options)=>{
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
exports.registerPlugin = (cli, options)=>{

  /*
  Params: 
    data: {
      inputFilePath:
      outputFilePath:
      fileName,
      appendFile: false 
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
exports.registerPlugin = (cli, options)=>{

  /*
  Params: 
    data: {
      inputFilePath:
      outputFilePath:
      fileName,
       appendFile: false 添加到文件尾还是替换全部内容， 默认false，替换全部内容
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

### build:end

全部编译，copy完成

```js
exports.registerPlugin = (cli, options)=>{
  cli.registerHook('build:end', (buildConfig, data, cb)=>{
    let outdir = buildConfig.outdir;
    let packageJSON = require(_path.join(process.cwd(), 'package.json'));
    let tarFile = _path.join(process.cwd(), `${packageJSON.name}@${packageJSON.version}.tar`);
    let commanderStr = `cd "${outdir}" && tar -cf "${tarFile}" .`;
    cli.utils.executeCommand(commanderStr, (error)=>{
      if(error){
        return cb(error);
      }
      console.log("文件打包完成")
      cb(null, data)
    })
  }, 1)
}
```