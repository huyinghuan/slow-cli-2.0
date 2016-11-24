'use strict';
const _path = require('path');

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
    if(!optionsArr || !optionsArr.length){cb(null, data, content)}
    let outputFileArr = [];
    let inputFilePath = data.inputFilePath;
    optionsArr.forEach((option)=>{
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
            outputFileArr.push(_path.join(data.outdir, option.target + option.postfix))
          }}
        )
      }
    })

    if(outputFileArr.length){
      data.outputFilePath = outputFileArr;
      data.appendFile = true
      content = `;/*${data.fileName} 👉*/;` + content;
    }
    cb(null, data, content)

  }, 100)

  // cli.registerHook('route:didRequest', (data, responseContent, cb)=>{
    
    

  // })
}