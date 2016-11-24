import * as _fs from 'fs';
import * as _path from 'path';

const regList = [
  /(\.js)$/,
  /(\.css)$/,
  /(\.html)$/
];

function match(realPath):boolean{
  for(let i = 0, length = regList.length; i < length; i++){
    if(regList[i].test(realPath)){
      return true
    }
  }
  return false
}

exports.registerPlugin = function(cli, options){
    cli.registerHook('route:didRequest', (req, data, content, cb)=>{
      let realPath = data.realPath;
      let filePath = _path.join(cli.cwd, realPath)
      if(!match(filePath)){
        return cb(null, data, content)
      }
      if(!_fs.existsSync(filePath)){
        return cb(null, data, content)
      }
      data.status = 200;
      _fs.readFile(filePath, 'utf8', (error, fileContent)=>{
        cb(error, data, fileContent)
      })
  }, 0)
}
