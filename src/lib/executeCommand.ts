
import _log from './log';
import * as _child from 'child_process';
import * as _ from 'lodash';
//执行命令
export default function executeCommand(command:string, setting, cb?){

  let options ={
    env: process.env,
    maxBuffer: 20 * 1024 * 1024
  }
  if(_.isFunction(setting)){
    cb = setting
  }else if(_.isPlainObject(setting)){
    _.extend(options, setting)
  }
  let stdout = '';
  let stderr = '';
  let exec = _child.exec(command, options);

  exec.on('close', (code)=>{
    _log.info(stdout)
    _log.error(stderr)
    if(code != 0){
      _log.error(`执行命令出错 -> ${command}`.red);
      return cb(`执行命令出错 -> ${command}`)
    }
    cb(null)
  })
  exec.stdout.on('data',  (message)=>{
    stdout += message
  })
   exec.stderr.on('data',  (message)=>{
    stdout += message
  })
}