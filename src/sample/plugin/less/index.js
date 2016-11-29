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
  },
  ignore: [],
  global: [],
  _golbal: []
}

//判断该文件是否需要处理
const isNeedCompile = (pathname)=>{
  let reg = new RegExp(_DefaultSetting.regexp)
  return reg.test(pathname.toLowerCase())
}

//根据实际路径获取文件内容
const getCompileContent = (cli, realFilePath, data, cb)=>{
  if(!_fs.existsSync(realFilePath)){
    data.status = 404
    return cb(null, data, null)
  }

  let fileContent = _fs.readFileSync(realFilePath, {encoding: 'utf8'})
  
  //----------- 全局 less 开始 ---------- //
  let globaleLessContent = [];
  let lessGlobal = [].concat(_DefaultSetting.global)
  //获取环境相关全局less，添加到每个less文件后
  let _env_global = [].concat(_DefaultSetting._env_global)
  _env_global.forEach((filename)=>{
    globaleLessContent.push(cli.runtime.getRuntimeEnvFile(filename, true)); 
  })

  //获取全局less，添加到每个less文件后
  lessGlobal.forEach((filename)=>{
     globaleLessContent.push(_fs.readFileSync(_path.join(cli.cwd, filename)));
  });

  fileContent = fileContent + globaleLessContent.join(';');
  //----------- 全局 less 结束 ---------- //

  _less.render(fileContent, _DefaultSetting.options, (e, result)=>{
    if(e){return cb(e)}
    //编译成功，标记状态码
    data.status = 200;
    cb(null, data, result.css)
  })
} 

function needIgnore(filename, ignoreRegList){
  for(let i = 0, length = ignoreRegList.length; i < length; i++){
    if(new RegExp(ignoreRegList[i]).test(filename)){
      return true
    }
  }
  return false
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

    getCompileContent(cli, realFilePath, data, (error, data, content)=>{
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

    _DefaultSetting.ignore = [].concat(_DefaultSetting.global).concat(_DefaultSetting.ignore)
    //查看忽略
    if(_DefaultSetting.ignore && _DefaultSetting.ignore.length > 0){
      if(needIgnore(inputFilePath, _DefaultSetting.ignore)){
        data.ignore = true;
        return cb(null, data, content)
      }
    }

    getCompileContent(cli, inputFilePath, data, (error, data, content)=>{
      if(data.status == 200){
        data.outputFilePath = data.outputFilePath.replace(/(\less)$/, "css")
      }
      cb(error, data, content);
    })
  })
}