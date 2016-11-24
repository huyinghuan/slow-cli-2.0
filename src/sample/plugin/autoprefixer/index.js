'use strict';
const _postcss = require('postcss');
const _autoprefixer = require('autoprefixer');
const _ = require('lodash');

var _DefaultSetting = {
  "regexp": "(\.css)$",
  "options": {}
}

//判断该文件是否需要处理
const isNeedCompile = (pathname)=>{
  let reg = new RegExp(_DefaultSetting.regexp)
  return reg.test(pathname.toLowerCase())
}

exports.registerPlugin = function(cli, options){
  _.extend(_DefaultSetting, options)
  let setting = _DefaultSetting.options || {};
  let cleaner = _postcss([_autoprefixer(setting)])
  cli.registerHook('route:willResponse', (req, data, responseContent, cb)=>{
    if(!isNeedCompile(data.realPath)){
      return cb(null, responseContent)
    }
    if(!responseContent){
      return cb(null, responseContent)
    }
    cleaner.process(responseContent)
      .then((result)=>{
        result.warnings().forEach((warn)=>{
          console.warn(warn.toString())
        });
        cb(null, result.css)
      })
      .catch((error)=>{cb(error);})
  }, 1)

  cli.registerHook('build:doCompile', (data, content, cb)=>{
    let outputFilePath = data.outputFilePath;
    if(!/(\.css)$/.test(outputFilePath) || !content){
      return cb(null, data, content)
    }
    cleaner.process(content)
      .then((result)=>{
        result.warnings().forEach((warn)=>{
          cli.log.warn(warn.toString())
        });
        cb(null, data, result.css)
      })
      .catch((error)=>{cb(error);})
  }, 50)

}