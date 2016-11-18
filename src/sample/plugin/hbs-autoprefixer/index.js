'use strict';
const _ = require('lodash');
const _htmlAutoprefixer = require('html-autoprefixer');

const _path = require('path');

var _DefaultSetting = {
  "regexp": "(\.html)$",
  "options": {}
}

//判断该文件是否需要处理
const isNeedProcess = (pathname)=>{
  let reg = new RegExp(_DefaultSetting.regexp)
  return reg.test(pathname.toLowerCase())
}

exports.registerPlugin = function(cli, options){
  _.extend(_DefaultSetting, options);
  
  cli.registerHook('route:willResponse', (req, data, responseContent, cb)=>{
    let pathname = data.realPath;
    if(!isNeedProcess(pathname)){
      return cb(null,  responseContent)
    }
    //没有经过 hbs 编译, 纯html,不处理
    if(data.status != 200){
      return cb(null, responseContent)
    }

    try{
      cb(null, _htmlAutoprefixer.process(responseContent, _DefaultSetting.options))
    }catch(e){
      cb(e)
    }
  }, 1)

  // cli.registerHook('build:didBuild', (data, content, cb)=>{
  //   if(!/(\.hbs)$/.test(data.inputFilePath) || data.status != 200){
  //     return cb(null, data, content)
  //   }

  //   try{
  //     cb(null, _htmlAutoprefixer.process(content, _DefaultSetting.options))
  //   }catch(e){
  //     cb(e)
  //   }

  // })

}