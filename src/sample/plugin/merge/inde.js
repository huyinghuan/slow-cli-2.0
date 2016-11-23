'use strict';
const _path = require('path')
function isMatchRegExp(str, arr){
  if(!arr || arr.length == 0){return false}
  for(let i = 0, length = arr.length; i < length; i++){
    if(new RegExp(arr[i]).test(str)){
      return true
    }
  }
  return false
}

exports.registerPlugin = (cli, optionsArr)=>{
  cli.registerHook('build:didCompile', (data, content, cb)=>{
    
    if(!options || !options.length){cb(null, data, content)}
    
    let outputFileArr = [];
    let inputFilePath = data.inputFilePath;
    (optionsArr as Array).forEach((option)=>{
      //正则表达式匹配模式
      if(option._regexp){
        if(isMatchRegExp(inputFilePath, option.source)){
          outputFileArr.push(_path.join(data.outdir, option.target))
        }
      }else{
        //字符串匹配模式
        if(!option.source || option.source.length  < 1){return}

        option.source.forEach((filename)=>{
          if(inputFilePath.indexOf(`${option.suffix}${filename}${option.postfix}`) != -1){
            outputFileArr.push(_path.join(data.outdir, option.suffix, option.target, option.postfix))
          }}
        )
      }
    })
    data.outputFile = outputFileArr.length ? outputFileArr : data.outputFile;
    data.appendFile = true
    content = `/*${data.filename}*/\n` + content
    cb(null, data, content)

  })
}