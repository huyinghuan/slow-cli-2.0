import * as _path from 'path';
import * as _ from "lodash";
import * as _fs from 'fs';
import _configFiledConstant from '../../../config-filed-constant';
import * as _mimeTypes from "mime-types";

exports.registerPlugin = function(cli){
  cli.registerHook('route:notFound', async function (req, resp){
    let workspace = _configFiledConstant.getWorkspace()
    let path = req.path;
    if(path == '/'){
      path = `/${cli.options.index}`;
    }
    let responseFilePath =  _path.join(workspace, _.compact(path.split('/')).join(_path.sep))
    let mime = _mimeTypes.lookup(responseFilePath) || "application/octet-stream"
    if(_fs.existsSync(responseFilePath)){
      resp.writeHead(200, { 'Content-Type': mime });
      return new Promise((resolve, reject)=>{
        _fs.readFile(responseFilePath, (err, data)=>{
          if(err){
            reject(err)
          }
          resp.write(data)
          resp.end()
          resolve(true)
        })
      })
    }
    return false
  })
}