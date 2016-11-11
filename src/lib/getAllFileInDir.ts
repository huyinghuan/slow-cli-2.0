import * as _fs from 'fs';
import * as _path from 'path';

const getAllFileInDir = function(dir:string, fileQueue:Array<string>, shouldeInclude:Function):Array<string>{
  fileQueue = fileQueue || [];
  let files = _fs.readdirSync(dir)
  files.forEach((fileName)=>{
    let filePath = _path.join(dir, fileName);
    //注入规则
    if(!shouldeInclude(fileName, filePath)){
      return
    }
    if(_fs.statSync(filePath).isDirectory()){
      getAllFileInDir(filePath, fileQueue, shouldeInclude)
    }else{
      fileQueue.push(filePath)
    }
    
  })
  return fileQueue
}

export default getAllFileInDir;