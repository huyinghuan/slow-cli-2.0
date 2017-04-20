
import * as _project from '../project';
import * as _fs from 'fs-extra';
import * as _path from 'path';
import * as _async from 'async';
import * as _request from 'request';

import _getMD5 from '../lib/getMD5';
import _executeCommand from '../lib/executeCommand';
import _configFiledConstant from '../config-filed-constant';
import * as _init from '../init'
import _publicConfig from '../public'
import * as _glob from 'glob'
import * as _ignore from "ignore"
import _log from '../lib/log';

//copy all
const copyAll = (workspace, tmpDirPath, next)=>{
    _glob('**', {
        cwd: workspace,
        mark: true
      }, (err, files) => {
        if (err) {
          return next(err)
        }
        let gitignoreFilePath = _path.join(workspace, ".gitignore")
        let filtered = []
        if(_fs.existsSync(gitignoreFilePath)){
          filtered = _ignore().add(_fs.readFileSync(gitignoreFilePath).toString()).filter(files)
        }else{
          filtered = _ignore().add("node_modules").filter(files)
        }
        if(filtered.length == 0){
          return next(null)
        }
        _fs.ensureDirSync(tmpDirPath);
        _async.mapSeries(filtered, (file, mapNext)=>{
          let sourceFilePath = _path.join(workspace, file)
          let targetFilePath = _path.join(tmpDirPath, file)
          _fs.stat(sourceFilePath, (err, stat)=>{
            if(err){return mapNext(err, null)}
            if(stat.isDirectory()){
              _fs.ensureDirSync(targetFilePath)
            }else if(stat.isFile()){
              _log.info(`copy ${file}`)
              _fs.copySync(sourceFilePath,targetFilePath)
            }else{
              _log.warn(`找不到 ${sourceFilePath} 文件类型`)
            }
            mapNext(null, null)
          })
        }, (err, reuslt)=>{
          next(err)
        })
    })
}

const copyFiles = ()=>{

}

//上传配置
export function upload(options, finish){
  _init.prepareUserEnv(options.workspace);
  let project = _project.getProjectPackageJSON();
  let projectName = options.projectName || project.name;
  let version = options.projectVersion || project.version || "";

  let configFiledConstant = _configFiledConstant.get();
  let defConfigServerIP = configFiledConstant.configServer;

  if(!projectName){console.log('缺少配置文件名称，无法上传，请使用 -n 指定')}
  if(!version){console.log('缺少配置文件版本，无法上传，请使用 -v 指定')}
  let tmpDirName = projectName + "-" + version;

  let workspace = _configFiledConstant.getWorkspace()
  let tmpDirPath = _path.join(workspace, tmpDirName)
  let tmpTarFilePath = tmpDirPath + ".tar"
  let commanderStr = `cd "${tmpDirPath}" && tar -cf "${tmpTarFilePath}" .`;

  let queue = [];
  
  queue.push((next)=>{
    //上传所有
    if(options.all){
      return copyAll(workspace, tmpDirPath, (err)=>{
        if(err){return next(err)}
        if(_fs.existsSync(configFiledConstant.environmentRootDir)){
          _fs.copySync(configFiledConstant.environmentRootDir, _path.join(tmpDirPath, '.silky'))
        }
        next(null)
      })
    }
    //仅上传配置
    try{
      _fs.ensureDirSync(tmpDirPath);
      _fs.copySync(configFiledConstant.CLIConfigFile, _path.join(tmpDirPath, 'package.json'))
      if(_fs.existsSync(configFiledConstant.environmentRootDir)){
        _fs.copySync(configFiledConstant.environmentRootDir, _path.join(tmpDirPath, '.silky'))
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
    let serverIp = options.url || _publicConfig.silky_config_store;
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
    finish(error, `${projectName}-${version}`)
  })
}

//下载配置
export function sync(options, finish){
  _init.prepareUserEnv(options.workspace);
  let project = _project.getProjectPackageJSON();
  let projectName = options.projectName || project.name;
  let version = options.projectVersion || project.version;

  let configFiledConstant = _configFiledConstant.get();
  if(!projectName){
    return console.log("Error: 未制定项目名称".red)
  }
  let serverIp =  options.url || _publicConfig.silky_config_store;
  console.log(serverIp, 999)
  let queue = [];
  let file = "";
  let fileHash = "";
  console.log('开始同步...')
  queue.push((next)=>{
    _fs.removeSync(configFiledConstant.CLIConfigFile)
    next(null)
  })
  queue.push((next)=>{
    let req = _request({
      uri: `/api/p/${projectName}/v/${version}`,
      baseUrl: serverIp,
      method: 'GET',
    })
    req.on('response', (resp)=>{
      if(resp.statusCode !== 200){
        return next(new Error('http code ' + resp.statusCode))
      }
      fileHash = resp.headers['content-disposition'];
      file = _path.join(_configFiledConstant.getWorkspace(), fileHash + ".tar");
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
    let commandStr = `tar -xf ${file} -C ${_configFiledConstant.getWorkspace()}`;
     _executeCommand(commandStr, (error)=>{
      if(error){
        console.log(`解压失败，请手动解压文件 ${file} 到项目根目录`)
        return next(error)
      }
      _fs.removeSync(file);
      next(null)
    })
  })

  _async.waterfall(queue, finish)
}
/* istanbul ignore next  */
export function commander(_commander){
  _commander.command('sync')
    .description('同步配置文件')
    .option('-w, --workspace <value>', '指定工作目录')
    .option('-u, --url <value>', '指定配置存储服务器地址')
    .option('-n, --projectName <value>', "指定同步的项目名称，可选，默认为 package.json => name")
    .option('-v, --projectVersion <value>', "指定同步的项目版本号， 可选，默认为 package.json => version")
    .action((program)=>{
        sync(program, (error)=>{
          if(error){
            console.log(error)
          }else{
            console.log('同步配置文件成功！请运行 silky install 安装插件。')
          }
        });
    })
  _commander.command('up')
    .description('上传配置文件')
    .option('-w, --workspace <value>', '指定工作目录')
    .option('-u, --url <value>', '指定配置存储服务器地址')
    .option('-a, --all', "包括项目文件全部上传")
    .option('-n, --projectName <value>', "指定同步的项目名称，可选，默认为 package.json => name")
    .option('-v, --projectVersion <value>', "指定同步的项目版本号， 可选，默认为 package.json => version")
    .option('-l, --log <value>', 'log日志,( 0[defaul]: show all; 1: show error, fail; 2: show error, fail, warn)',(value)=>{_log.setLevel(value)})
    .action((program)=>{
      upload(program, (error, result)=>{
        if(error){
          console.log("上传失败, 错误信息：".red)
          console.log(error)
          return
        }
        console.log(`上传 ${result} 成功！`)
      });
    })
}

