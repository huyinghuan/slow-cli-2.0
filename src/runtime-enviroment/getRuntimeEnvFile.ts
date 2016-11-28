import * as _init from '../init/index';
import * as _fs from 'fs-extra';
import * as _path from 'path';
import _configFiledConstant from '../config-filed-constant'
/**
 * desc:
 *   搜索顺序  指定的运行环境【默认:develop】 -->  通用目录搜索 -->  .silky根目录
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
  let filepath = "";
  //存在运行环境下的文件返回运行环境下的文件内容
  if(_fs.existsSync(_path.join(env.enviromentDir, filename))){
     filepath = _path.join(env.enviromentDir, filename)
  }else if(_fs.existsSync(_path.join(_configFiledConstant.normalEnviromentDir, filename))){
    //如果不存在 读取 通用环境目录下的内容
    filepath = _path.join(_configFiledConstant.normalEnviromentDir, filename)
  }else if(_fs.existsSync(_path.join(_configFiledConstant.environmentRootDir, filename))){
    filepath = _path.join(_configFiledConstant.environmentRootDir, filename)
  }

  if(filepath == ""){
    throw new Error("文件未找到")
  }
  if(asString){
    return _fs.readFileSync(filename, "utf8")
  }
  return require(filepath)
}