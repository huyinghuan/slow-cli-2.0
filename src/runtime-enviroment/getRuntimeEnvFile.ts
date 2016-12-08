import * as _init from '../init/index';
import * as _fs from 'fs-extra';
import * as _path from 'path';
import * as _ from 'lodash'
import _configFiledConstant from '../config-filed-constant'
/**
 * desc:
 *   搜索顺序  指定的运行环境【默认:develop】 -->  通用目录搜索
 * 
 * params:
 *    filename, 文件名称
 *    asString 作为string返回
 *    
 * return:
 *    string or jsonObject 
 * 
 * throw Error
 */

export default function(filename:string, asString?:boolean):any{
  if(!filename){
    throw new Error(`获取文件名undefined`)
  }
  let env = _init.getEnviroment();
  let envFilepath = "";
  let normalFilePath = "";
  
  if(_fs.existsSync(_path.join(env.enviromentDir, filename))){
    envFilepath = _path.join(env.enviromentDir, filename)
  }
  //是否存在 通用环境目录下的内容
  if(_fs.existsSync(_path.join(_configFiledConstant.normalEnviromentDir, filename))){
    normalFilePath = _path.join(_configFiledConstant.normalEnviromentDir, filename)
  }

  if(envFilepath == "" && normalFilePath == ""){
    throw new Error(`${filename} 文件未找到`)
  }

  //作为文件内容读取顺序
  if(asString){
    //存在运行环境下的文件返回运行环境下的文件内容
    //如果不存在运行环境下的文件 读取通用环境目录下的内容
    let filePath = !!envFilepath ? envFilepath : normalFilePath;
    return _fs.readFileSync(filePath, "utf8")

  }
  
  let normalBase = {}
  let envBase = {}
  //作为数据读取顺序
  if(!!normalFilePath){
    normalBase = require(normalFilePath)
  }

  if(!!envFilepath){
    envBase = require(envFilepath)
  }

  Object.keys(envBase).forEach((key)=>{
    //避免误解
    if(normalBase[key] === null || normalBase[key] === undefined){
      normalBase[key] = envBase[key]
    }

    if(!_.isPlainObject(envBase[key])){
      normalBase[key] = envBase[key]
    }
    normalBase[key] = _.extend(normalBase[key], envBase[key])
  })

  return  normalBase
}