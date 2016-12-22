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

  cli.registerHook('build:doCompile', (buildConfig, data, content, cb)=>{
    cb(error, content)
  })
}

```