import _log from './lib/log';
import _formatContentLength from './lib/fortmatContentLength'
import * as _url from 'url'
import * as _querystring from 'querystring'
import * as _fs from 'fs';
import * as _path from 'path';
import _configFiledConstant from './config-filed-constant';


export function showResponseTime(req, resp){
  let startTime = Date.now()
  resp.on('finish', ()=>{
    let spellTime = Date.now() - startTime
    let msg = `( ${req.url} ): ${spellTime} ms: [${resp.statusCode}] size:`
    switch(resp.statusCode){
      case 304 : _log.info(msg.grey); break;
      case 401:
      case 403:
      case 404:
      case 500:  _log.error(msg.red); break;
      default:
        _log.info(msg.gray, `${_formatContentLength((resp as any)._contentLength)}`);
    }
  })
}

export function  parseURL(url:string){
  let urlObj:any = _url.parse(url)
  urlObj.query = _querystring.parse(urlObj.query)
  urlObj.path = urlObj.pathname
  return urlObj
}

export async function isDir(path){
  return new Promise((resolve, reject)=>{
    _fs.stat(_path.join(_configFiledConstant.getWorkspace(), path), (error, stat)=>{
      if(error){
        return resolve(false)
      }
      if(!stat.isDirectory() || !_configFiledConstant.getGlobal('autoindex')){
        return resolve(false)
      }
      resolve(true)
    })
  })
}