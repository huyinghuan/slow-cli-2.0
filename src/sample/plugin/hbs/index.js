'use strict';
const _ = require('lodash');
const _url = require('url');
const _path = require('path');
const _fs = require('fs'); 
const _handlebars = require('handlebars');
const _helper = require('./helper');

var _DefaultSetting = {
  "root": ".",
  "regexp": "(\.html)$"
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
  try{
    let template = _handlebars.compile(fileContent);
    //编译成功，标记状态码
    data.status = 200;
    //这里可以添加数据获取逻辑 TODO
    cb(null, data, template({}))
  }catch(e){
    cb(e)
  }
} 

exports.registerPlugin = function(cli, options){
  //继承定义
  _.extend(_DefaultSetting, options);

  //加载handlebars  helper
  _helper(_handlebars, cli.ext['hbs']);

  cli.registerHook('route:didRequest', (req, data, content, cb)=>{
    let pathname = data.realPath;
    //如果不需要编译
    if(!isNeedCompile(pathname)){
      return cb(null, data, content)
    }  
    let fakeFilePath = _path.join(process.cwd(), _DefaultSetting.root, pathname);
    //替换路径为hbs
    let realFilePath = fakeFilePath.replace(/(html)$/,'hbs')
    getCompileContent(realFilePath, data, (error, data, content)=>{
      if(error){return cb(error)};
      //交给下一个处理器
      cb(null, data, content)
    })
  },1)


  cli.registerHook('build:doCompile', (data, content, cb)=>{
    let inputFilePath = data.inputFilePath;
    if(!/(\.hbs)$/.test(inputFilePath)){
      return cb(null, data, content)
    }
    getCompileContent(inputFilePath, data, (error, data, content)=>{
      if(error){return  cb(error);}
      if(data.status == 200){
        data.outputFilePath = data.outputFilePath.replace(/(\hbs)$/, "html")
      }

      cb(error, data, content);
    })

  }, 1)
}