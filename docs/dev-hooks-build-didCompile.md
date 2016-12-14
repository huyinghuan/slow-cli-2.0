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
      outdir: buildConfig.outdir,
      inputFileRelativePath:  _path.join(fileItem.relativeDir, fileItem.fileName),
      outputFileRelativePath: _path.join(buildConfig.outRelativeDir, fileItem.relativeDir, fileItem.fileName),
      ignore: false 是否取消对该文件处理 不处理，不copy
      appendTo: true
    }
    content 编译文件内容

    这中间 data 还可能被赋予其他值：
      status: 200 编译成功。 没有该值则认为编译失败
    
    编译完成后记得修改实际输出文件名
      data.outputFilePath = xxx;
  */

  cli.registerHook('build:didCompile', (buildConfig, data, content, cb)=>{
    cb(error, data, content)
  })
}

```