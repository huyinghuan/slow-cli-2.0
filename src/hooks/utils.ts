import * as _minimatch from 'minimatch';
import * as _ from 'lodash';
import * as _fs from 'fs-extra';
import * as _child from 'child_process';
import _log from '../lib/log';
/**
 * 文件后缀匹配
 */
export function match(path, express){
  return _minimatch(path, express, {matchBase: true})  
}

/**
 *lodash.extend
 */
export function extend(){
  return _.extend.apply(null, arguments)
}

export function outputFile(){
  return _fs.outputFile.apply(null, arguments)
}

export function outputFileSync(){
  return _fs.outputFileSync.apply(null, arguments)
}

export function ensureFileSync(){
  return _fs.ensureFileSync.apply(null, arguments)
}

//执行命令
export function executeCommand(command:string, cb){
  let options ={
    env: process.env,
    maxBuffer: 20 * 1024 * 1024
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
    console.log(message)
    stdout += message
  })
   exec.stderr.on('data',  (message)=>{
    console.log(message)
    stdout += message
  })
}