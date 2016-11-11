/**
 *校验build参数 */

import * as _path from 'path';
import * as _init from './index'

function checkPort():boolean{
  let port = ~~_init.getFullConfig().port;
  if(port > 65535){
    console.log("port 设置值超过系统最大值 65535".red)
    return false
  }
  if(port < 1024){
    console.log("不建议使用1024以下系统端口，请修改".red)
    return false
  }
  return true
}

export default function(){
  return checkPort()
}