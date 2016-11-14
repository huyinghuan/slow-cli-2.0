import * as _minimatch from 'minimatch';
import * as _ from 'lodash';

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