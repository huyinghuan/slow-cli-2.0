'use strict';
const _path = require('path');
const _request = require('request');
const _url = require('url')

//从文件内容获取数据地址

const getDataFromUrl = (url, dataConfig, cb)=>{
  let headers = dataConfig.headers || {};
  let queryParams = dataConfig.queryParams || {};

  let urlObj = _url.parse(url);

  queryParams = _.extend( _querystring.parse(urlObj.query), queryParams);
  
  let options = {
    url: `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`,
    qs: queryParams,
    headers: headers,
    timeout: 15000
  };

  _request(options, (error, response, body)=>{
    if (error){
      return cb(error)
    }
    if(response.statusCode != 200){
      return cb(new Error(`错误，状态码${response.statusCode}`))
    }
    try{
      body = JSON.parse(body);
      cb(null, body)
    }catch(e){
      cb(new Error("Can not parse body"))
    }
  })

}

//根据数据路径获取数据
const isUrl = (url)=>{
  return /^((http\:\/\/)|(htpps\:\/\/))/.test(url)
}

module.exports = (cli, dataUrl, dataConfig, cb)=>{
  if(isUrl(dataUrl)){
    return getDataFromUrl(dataUrl, dataConfig, cb)
  }
  try{
    let context = cli.getRuntimeEnvFile(dataUrl);
    cb(null, context)
  }catch(e){
    cb(e)
  }
}
