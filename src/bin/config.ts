
import * as _project from '../project';
import * as _fs from 'fs-extra';
import * as _path from 'path';
import * as _async from 'async';
import * as _request from 'request';

import _getMD5 from '../lib/getMD5';
import _executeCommand from '../lib/executeCommand';
import _config from '../config-filed-constant';

const _defConfigServer =  _config.configServer;

//上传配置
const updateload = function(project, options){
  let projectName = options.projectName || project.name;
  let version = options.projectVersion || project.version || "";

  if(!projectName){console.log('缺少配置文件名称，无法上传，请使用 -n 指定')}
  if(!version){console.log('缺少配置文件版本，无法上传，请使用 -v 指定')}
  let tmpDirName = projectName + "-" + version;
  let tmpDirPath = _path.join(process.cwd(), tmpDirName)
  let tmpTarFilePath = tmpDirPath + ".tar"
  let commanderStr = `cd "${tmpDirPath}" && tar -cf "${tmpTarFilePath}" .`;

  let queue = [];

  queue.push((next)=>{
    try{
      _fs.ensureDirSync(tmpDirPath);
      _fs.copySync(_path.join(process.cwd(), 'package.json'), _path.join(tmpDirPath, 'package.json'))
      if(_fs.existsSync(_path.join(process.cwd(), '.silky'))){
        _fs.copySync(_path.join(process.cwd(), '.silky'), _path.join(tmpDirPath, '.silky'))
      }
      next(null)
    }catch(e){
      next(e)
    }
  })

  queue.push((next)=>{
    _executeCommand(commanderStr, next)
  })

  queue.push((next)=>{
    _getMD5(tmpTarFilePath, next)
  })

  queue.push((md5, next)=>{
    let serverIp =  options.url || project["config-server"] || _defConfigServer;
    if(!serverIp){
      return next(new Error('未指定配置服务器IP'));
    }
    _request({
      uri: `/api/p/${projectName}/v/${version}/h/${md5}`,
      baseUrl: serverIp,
      method: 'PUT',
      formData: {
        config: _fs.createReadStream(tmpTarFilePath)
      }
    }, (error, resp, body)=>{
      console.log(md5)
      if(error){return next(error)}
      console.log(body)
      if(resp.statusCode != 200){
        next(`http code: ${resp.statusCode}`)
      }else{
        next()
      }
    })
  })

  _async.waterfall(queue, (error)=>{
    _fs.removeSync(tmpDirPath)
    _fs.removeSync(tmpTarFilePath)
    if(error){
      console.log("上传失败, 错误信息：".red)
      console.log(error)
      return
    }
    console.log(`上传 ${projectName}-${version} 成功！`)
  })
}

//下载配置
const sync = function(project, options){
  let projectName = options.projectName || project.name;
  let version = options.projectVersion || project.version;
  if(!projectName){
    return console.log("Error: 未制定项目名称".red)
  }
  let serverIp =  options.url || project["config-server"] || _defConfigServer;
  let queue = [];
  let file = "";
  let fileHash = "";
  console.log('开始同步...')
  queue.push((next)=>{
    _fs.removeSync(_path.join(process.cwd(), ".silky"))
    next(null)
  })
  queue.push((next)=>{
    let req = _request({
      uri: `/api/p/${project.name}/v/${project.version}`,
      baseUrl: serverIp,
      method: 'GET',
    })
    req.on('response', (resp)=>{
      if(resp.statusCode !== 200){
        return next(new Error('http code ' + resp.statusCode))
      }
      fileHash = resp.headers['content-disposition'];
      file = _path.join(process.cwd(), fileHash + ".tar");
      let fws =_fs.createWriteStream(file);
      resp.pipe(fws)
      resp.on('end', ()=>{
        next(null)
      })
    })
    req.on('error', (error)=>{next(error)})
  })
  //获取文件hash值
  queue.push((next)=>{
    _getMD5(file, (next))
  });
  //对比服务器端hash值
  queue.push((md5, next)=>{
    console.log(md5, fileHash)
    if(md5 !== fileHash){
      return next(new Error('文件下载错误，请重新下载！'))
    }
    next(null)
  });

  //解压文件并删除文件
  queue.push((next)=>{
    let commandStr = `tar -xf ${file}`;
     _executeCommand(commandStr, (error)=>{
      if(error){
        console.log(`解压失败，请手动解压文件 ${file} 到项目根目录`)
        return next(error)
      }
      _fs.removeSync(file);
      next(null)
    })
  })

  _async.waterfall(queue, (error)=>{
    if(error){
      console.log(error)
    }else{
      console.log('同步配置文件成功！请允许 silky install 安装插件。')
    }
  })
}

export function execute(actionName, program){
  let packageJSON = _project.getProjectPackageJSON();
  switch(actionName){
    case "up": updateload(packageJSON, program); break;
    case "sync": sync(packageJSON, program); break;
  }
}

export function commander(_commander){
  _commander.command('config <actionName>')
    .description('上传或者同步配置文件 up or sync ')
    .option('-u, --url <value>', '指定配置存储服务器地址')
    .option('-n, --projectName <value>', "指定同步的项目名称，可选，默认为 package.json => name")
    .option('-v, --projectVersion <value>', "指定同步的项目版本号， 可选，默认为 package.json => version")
    .action(execute)
}