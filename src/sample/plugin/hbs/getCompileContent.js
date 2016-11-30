const _fs = require('fs')
const _handlebars = require('handlebars');
const _async = require('async');
const _fetchData = require('./fetch-data');

/**
 * Desc: 根据实际路径获取文件内容
 * params <cli>
 * params <crossData> 调用hook过程中的传递的数据
 * params <realFilePath> string ,真实文件路径
 * params <relativPpathname> string, 相对文件路径
 * params <dataConfig> JSONObject
 */
module.exports = (cli, crossData, realPathname, relativPathname, dataConfig, callback)=>{

  let queue = [];
  //是否在dataMap中配置了路径
  queue.push((asyncNext)=>{
    let dataMap = dataConfig['dataMap'];
    let relativPathname = relativPathname.replace(_path.extname(relativPathname), "")
    //数据路径映射
    let dataUrl = dataMap[pathname];
    //如果没有数据路径映射 返回false
    if(!dataUrl){
      return asyncNext(null, false)
    }

    let baseUrl = dataConfig.baseUrl || "";
    dataUrl = _path.join(baseUrl, dataUrl)

    _fetchData(cli, dataUrl, dataConfig, asyncNext)
  })
  //读取文件内容
  queue.push((context, asyncNext)=>{
     let fileContent = _fs.readFile(realFilePath, {encoding: 'utf8'}, (error, content)=>{
       asyncNext(error, context, content)
     })
  })

  //是否需要读取文件内配置
  queue.push((context, content, asyncNext)=>{

    if(context !== false){
      return asyncNext(null, context, content)
    }
    let reg = /\{\{\!\-\- \s* PAGE_DATA\s*[:：]\s*(\w+)\s*\-\-\}\}/g;
    let result = reg.exec(content)
    let dataUrlInContent = ""
    if(result && result[1]){
      dataUrlInContent = result[1]
    }
    //如果没有配置，则直接编译文件
    if(!dataUrlInContent){
      return asyncNext(null, {}, content)
    }
    _fetchData(cli, dataUrlInContent, dataConfig, (error, context)=>
      asyncNext(error, context, content)
    )
  })

  queue.push((context, content, asyncNext)=>{
    try{
      let template = _handlebars.compile(content);
      //编译成功，标记状态码
      crossData.status = 200;
      //这里可以添加数据获取逻辑 TODO
      asyncNext(null, crossData, template(context))
    }catch(e){
      asyncNext(e)
    }
  })

  _async.waterfall(queue, callback)
}