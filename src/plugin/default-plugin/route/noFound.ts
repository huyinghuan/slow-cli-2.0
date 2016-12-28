import * as _path from 'path';
import * as _ from 'lodash';
import * as _fs from 'fs';
import _configFiledConstant from '../../../config-filed-constant';

exports.registerPlugin = function(cli){
  cli.registerHook('route:notFound', function(req, resp, cb){
    let workspace = _configFiledConstant.getWorkspace()
    let path = req.path;
    if(path == '/'){
      path = `/${cli.options.index}`;
    }
    let responseFilePath =  _path.join(workspace, _.compact(path.split('/')).join(_path.sep))
    if(_fs.existsSync(responseFilePath)){
      resp.sendFile(responseFilePath)
      return cb(true);
    }
    cb(false)
  })
}