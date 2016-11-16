import * as _minimatch from 'minimatch';
import * as _ from 'lodash';
import * as _fs from 'fs-extra';
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

export {_log as log}