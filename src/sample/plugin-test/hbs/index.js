'use strict';
const _ = require('lodash');
const _url = require('url');
const _path = require('path');
const _fs = require('fs'); 
const _handlebars = require('handlebars');
const _helper = require('./helper');

//加载handlebars  helper
_helper(_handlebars);

var _DefaultSetting = {
  "root": ".",
  "regexp": "(\.hbs|\.html)$"
}

const isNeedCompile = (pathname)=>{
  let reg = new RegExp(_DefaultSetting.regexp)
  return reg.test(pathname)
}


exports.registerPlugin = function(cli, options){
  //继承定义
  _.extend(_DefaultSetting, options.setting);
  
  cli.registerHook('route:didRequest', (req, data, content, cb)=>{
    //如果不需要编译
    if(!isNeedCompile(req.path)){
      return cb(null, data, content)
    }
    
    let fakeFilePath = _path.join(process.cwd(), _DefaultSetting.root, req.path);

    //替换路径为hbs
    let realFilePath = fakeFilePath.replace(/(html)$/,'hbs')

    //如果访问的文件不存在,则跳到下一步
    if(!_fs.existsSync(realFilePath)){
      return cb(null, data, content)
    }

    let fileContent = _fs.readFileSync(realFilePath, {encoding: 'utf8'})
    
    try{
      let template = _handlebars.compile(fileContent);
      //这里可以添加数据获取逻辑 TODO
      data.status = 200;
      cb(null, data, template({}))
    }catch(e){
      cb(error)
    }
    
  })
}