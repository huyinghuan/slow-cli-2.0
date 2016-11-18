'use strict';
const _url = require('url');
const _path = require('path');
const _fs = require('fs');
const _less = require('less');
const _ = require('lodash');


var _DefaultSetting = {
  "regexp": "(\.css)$",
  "options":{
    paths: ['.', _path.join(process.cwd(), 'css')]
  }
}

//判断该文件是否需要处理
const isNeedCompile = (pathname)=>{
  let reg = new RegExp(_DefaultSetting.regexp)
  return reg.test(pathname.toLowerCase())
}

//根据实际路径获取文件内容
const getCompileContent = (realFilePath, data, cb)=>{
  if(!_fs.existsSync(realFilePath)){
    data.status = 404
    return cb(null, data, null)
  }

  let fileContent = _fs.readFileSync(realFilePath, {encoding: 'utf8'})

  _less.render(fileContent, _DefaultSetting.options, (e, result)=>{
    if(e){return cb(e)}
    //编译成功，标记状态码
    data.status = 200;
    //这里可以添加数据获取逻辑 TODO
    cb(null, data, result.css)
  })
} 

exports.registerPlugin = function(cli, options){
  //继承定义
  _.extend(_DefaultSetting, options);
  
  cli.registerHook('route:didRequest', (req, data, content, cb)=>{
    //如果不需要编译
    if(!isNeedCompile(req.path)){
      return cb(null, data, content)
    }  
    let fakeFilePath = _path.join(process.cwd(), req.path);
    //替换路径为hbs
    let realFilePath = fakeFilePath.replace(/(css)$/,'less')

    getCompileContent(realFilePath, data, (error, data, content)=>{
      if(error){return cb(error)};
      //交给下一个处理器
      cb(null, data, content)
    })
  })

  cli.registerHook('build:doCompile', (data, content, cb)=>{
    let inputFilePath = data.inputFilePath;
    if(!/(\.less)$/.test(inputFilePath)){
      return cb(null, data, content)
    }
    getCompileContent(inputFilePath, data, (error, data, content)=>{
      if(data.status == 200){
        data.outputFilePath = data.outputFilePath.replace(/(\less)$/, "css")
      }
      if(error){
        console.log(error)
      }
      cb(error, data, content);
    })
  })
}