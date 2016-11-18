const _cleanCss = require('clean-css');
const _uglifyjs = require('uglify-js');
const _cheerio = require('cheerio');

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
  if(typeof options == 'boolean'){
    options = {}
  }
  return new _cleanCss(options).minify(content).styles;
}

function miniJS(content, options){
  if(typeof options == 'boolean'){
    options = {}
  }
  return _uglifyjs.minify(content, options).code
}

function miniHtml(content, options){
  if(typeof options == 'boolean'){
    options = {
      js: true,
      css: true
    }
  }

  let $ = _cheerio.load(content)
  if(options.js){
    $('script').each(function() {
      $(this).text(_uglifyjs.minify($(this).text(), {}).code)
    });
  }
  if(options.css){
    let clean = new _cleanCss({});
    $('style').each(function() {
     $(this).text(_uglifyjs.minify($(this).text(), options).styles)
    });
  }
  return $.html()
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
        content = miniCss(content, _defaultSetting.css)
      }else if(/(\.js)$/.test(outFilePath) && _defaultSetting.js){
        content = miniJS(content, _defaultSetting.css)
      }else if(/(\.html)$/.test(outFilePath) && _defaultSetting.html){
        content = miniHtml(content, _defaultSetting.html)
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