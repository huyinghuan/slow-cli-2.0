import _getAllFileInDir from './getAllFileInDir';
import * as _allDefine from '../all.d';

import _configFiledConstant from '../config-filed-constant';
/**
 * 是否应该处理该文件。
 * filename: string, filepath
 * return boolean.
 * 如果忽略 返回false
 * 如果处理 返回true
 */
function shouldInclude(filename, filepath):boolean{
  const _buildConfig = _configFiledConstant.getBuildConfig();
  //忽略build文件夹
  if(filepath.indexOf(_buildConfig.outdir) != -1){
    return false
  }

  //需要忽略掉文件
  const buildIgnore:Array<string> = _buildConfig.ignore;
  //需要包含的文件
  const buildInclude:Array<string> = _buildConfig.include;
  let flag = true 
  for(let i = 0, length = buildIgnore.length; i < length; i++){
    if(filepath.indexOf(buildIgnore[i]) != -1){
      flag = false
    }
    filepath = filepath.replace(/(\\)+/g, "/")
    if(new RegExp(buildIgnore[i]).test(filepath)){
      flag =  false
    }
  }

  for(let i = 0, length = buildInclude.length; i < length; i++){
    if(filepath.indexOf(buildInclude[i]) != -1){
      flag = true
    }
    filepath = filepath.replace(/(\\)+/g, "/")
    if(new RegExp(buildInclude[i]).test(filepath)){
      flag =  true
    }
  }
  return flag
}

/* 获取项目目录下的所有文件，除编译目录外*/
const getAllFileInProject = (justFilePath:boolean):Array<any>=>{
  let arr = _getAllFileInDir(_configFiledConstant.getWorkspace(), [], '.', shouldInclude)
  if(!justFilePath){return arr}
  let queue = [];
  arr.forEach((item)=>{queue.push(item.filePath)})
  return queue;
}

export default getAllFileInProject;