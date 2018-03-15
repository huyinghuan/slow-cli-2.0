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
    cli.registerHook('route:didRequest', async (req, data, content)=>{
      let realPath = data.realPath;
      let filePath = _path.join(cli.cwd(), realPath)
      if(!match(filePath)){
        return content
      }
      if(!_fs.existsSync(filePath)){
        return content
      }
      data.status = 200;
      return _fs.readFileSync(filePath, 'utf8')
  }, 0)
}
