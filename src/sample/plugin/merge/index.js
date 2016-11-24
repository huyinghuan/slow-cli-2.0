'use strict';
const _path = require('path');
const _fs = require('fs');

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
  if(!optionsArr || !optionsArr.length){
    cli.log.warn(`插件${require('./package.json').name}没有有效配置，跳过插件注册`.yellow)
    return;
  }
  cli.registerHook('build:didCompile', (data, content, cb)=>{
    let outputFileArr = [];
    let inputFilePath = data.inputFilePath;
    optionsArr.forEach((option)=>{
      //正则表达式匹配模式
      if(option._regexp){
        if(isMatchRegExp(inputFilePath, option.source)){
          let outTargetFile = _path.join(data.outdir, option.target)
          cli.log.info(`[merge:] ${data.inputFileRelativePath} to ${option.target}`)
          outputFileArr.push(outTargetFile)
        }
      }else{
        //字符串匹配模式
        if(!option.source || option.source.length  < 1){return}
        option.source.forEach((filename)=>{
          if(inputFilePath.indexOf(`${option.suffix}${filename}${option.postfix}`) != -1){
            cli.log.info(`[merge:] ${data.inputFileRelativePath} to ${option.target + option.postfix}`)
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

  cli.registerHook('route:didRequest', (req, data, content, cb)=>{
    let realPath = data.realPath;
    for(let i = 0, length = optionsArr.length; i < length; i++){
      let option = optionsArr[i];
      let target = option.target
      if(!option._regexp){
        target = target + option.postfix
      }
      if(realPath != target){
        continue
      }
      let responseContent = ""
      let sourceArr = option.source || [];
      try{
        if(option._regexp){
          let allFile = cli.utils.getAllFileInProject(true)
          let matchFileQueue = [];
          sourceArr.forEach((item)=>{
            let reg = new RegExp(item);
            allFile.forEach((filepath)=>{
              if(reg.test(filepath)){
                matchFileQueue.push(filepath)
              }
            })
          });
          matchFileQueue.forEach((filePath)=>{
            responseContent = responseContent + `;/*${_path.basename(filePath)} 👉*/;` + _fs.readFileSync(filePath)
          })
        }else{
          sourceArr.forEach((item)=>{
            let filepath = _path.join(cli.cwd, option.suffix, item + option.postfix)
            responseContent = responseContent + `;/*${_path.basename(filepath)} 👉*/;` + _fs.readFileSync(filepath)
          })
        }
        data.status = 200
        cb(null, data, responseContent)
      }catch(e){
        cb(e)
      }
      return
    }
    cb(null, data, content)
  }, 1)
}