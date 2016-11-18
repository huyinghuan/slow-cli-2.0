const _cleanCss = require('clean-css');
const _uglifyjs = require('uglify-js');

var _defaultSetting = {
  ignore: ["(\\.min\\.css)$","(\\.min\\.js)$"],
  js:{},
  css:{},
  html:{}
}

function ignore(path, rules){
  rules = rules || [];
  for(let i = 0, length = rules.length; i < length; i++){
    if(new RegExp(rules[i]).test(path)){
      return true
    }
  }
  return false
}

function miniCss(content, options){
  return new _cleanCss(options).minify(content).styles;
}

function miniJS(content, options){
  return _uglifyjs.minify(content, options).code
}

exports.registerPlugin = (cli, options)=>{
  
  cli.utils.extend(_defaultSetting, options);

  cli.registerHook('build:didCompile', (data, content, cb)=>{
    let inputFilePath = data.inputFilePath;
    let outFilePath = data.outputFilePath;
    if(ignore(outFilePath, _defaultSetting.ignore)){
      return cb(null, data, content)
    }
    try{
      if(/(\.css)$/.test(outFilePath) && _defaultSetting.css){
        content = miniCss(content, _defaultSetting.css || {})
      }else if(/(\.js)$/.test(outFilePath) && _defaultSetting.js){
        content = miniJS(content, _defaultSetting.css || {})
      }
      else{
        return  cb(null, data, content);
      }
      cli.log.info(`minify ${outFilePath}`);
    }catch(e){
      return cb(e)
    }
    cb(null, data, content);
  }, 99)

}