
import * as _project from '../project';
import * as _fs from 'fs-extra';
import * as _path from 'path';
import * as _request from 'request';
import * as _crossSpawn from 'cross-spawn'
import _getMD5 from '../lib/getMD5';
import _configFiledConstant from '../config-filed-constant';
import * as _init from '../init'
import _publicConfig from '../public'
import * as _glob from 'glob'
import * as _ignore from "ignore"
import _log from '../lib/log';

//copy all
const copyAll =async (workspace, tmpDirPath)=>{
  return new Promise((resolve, reject)=>{
    _glob('**', { cwd: workspace,  mark: true}, (err, files) => {
      if(err){
        return reject(err)
      }
      let gitignoreFilePath = _path.join(workspace, ".gitignore")
      let filtered:any = []
      if(_fs.existsSync(gitignoreFilePath)){
        filtered = _ignore().add(_fs.readFileSync(gitignoreFilePath).toString()).filter(files)
      }else{
        filtered = _ignore().add("node_modules").filter(files)
      }
      if(filtered.length == 0){
        return resolve()
      }
      _fs.ensureDirSync(tmpDirPath);
      for(let i = 0; i < filtered.length; i++){
        let file = filtered[i]
        let sourceFilePath = _path.join(workspace, file)
        let targetFilePath = _path.join(tmpDirPath, file)
        let stat = _fs.statSync(sourceFilePath)
        if(stat.isDirectory()){
          _fs.ensureDirSync(targetFilePath)
        }else if(stat.isFile()){
          _log.info(`copy ${file}`)
          _fs.copySync(sourceFilePath,targetFilePath)
        }else{
          _log.warn(`找不到 ${sourceFilePath} 文件类型`)
        }
      }
      resolve()
    })
  })
}

//上传配置
export async function upload(options){
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

  let queue = [];
  
  await copyAll(workspace, tmpDirPath)
  if(_fs.existsSync(configFiledConstant.environmentRootDir)){
    _fs.copySync(configFiledConstant.environmentRootDir, _path.join(tmpDirPath, '.silky'))
  }
  if(_fs.existsSync(_path.join(workspace, ".gitignore"))){
    _fs.copySync(_path.join(workspace, ".gitignore"), _path.join(tmpDirPath, '.gitignore'))
  }

  _fs.ensureDirSync(tmpDirPath);
  _fs.copySync(configFiledConstant.CLIConfigFile, _path.join(tmpDirPath, 'package.json'))
  if(_fs.existsSync(configFiledConstant.environmentRootDir)){
    _fs.copySync(configFiledConstant.environmentRootDir, _path.join(tmpDirPath, '.silky'))
  }
  await (function(){
    return new Promise((resolve, reject)=>{
      let results = _crossSpawn.sync("tar", ["-cf", `../${tmpDirName}.tar`, "."], {stdio: 'inherit', cwd: tmpDirPath})
      if(results.status != 0){
        _log.error(results)
        return reject("压缩项目失败")
      }
    })
  })()
  let md5 = await _getMD5(tmpTarFilePath)
  let serverIp = options.url || _publicConfig.silky_config_store;
  if(!serverIp){
    throw new Error('未指定配置服务器IP');
  }
  await (async function(){
    return new Promise((resolve, reject)=>{
      _request({
        uri: `/api/p/${projectName}/v/${version}/h/${md5}`,
        baseUrl: serverIp,
        method: 'PUT',
        formData: {
          config: _fs.createReadStream(tmpTarFilePath)
        }
      }, (error, resp, body)=>{
        if(error){return reject(error)}
        if(resp.statusCode != 200){
          reject(`http code: ${resp.statusCode}`)
        }else{
          resolve()
        }
      })
    })
   
  })();
  _fs.removeSync(tmpDirPath)
  _fs.removeSync(tmpTarFilePath)
  return `${projectName}-${version}`
}

//下载配置
export async function sync(options){
  _init.prepareUserEnv(options.workspace);
  let project = _project.getProjectPackageJSON();
  let projectName = options.projectName || project.name;
  let version = options.projectVersion || project.version;

  let configFiledConstant = _configFiledConstant.get();
  if(!projectName){
    return console.log("Error: 未制定项目名称".red)
  }
  let workspace = _configFiledConstant.getWorkspace()
  let serverIp =  options.url || _publicConfig.silky_config_store;
  let queue = [];
  let file = "";
  let fileHash = "";
  console.log('开始同步...')
  _fs.removeSync(configFiledConstant.CLIConfigFile)

  let uri = version ? `/api/p/${projectName}/v/${version}` : `/api/p/${projectName}`;

  await (function(){
    return new Promise((resolve, reject)=>{
      let req = _request({
        uri: uri,
        baseUrl: serverIp,
        method: 'GET',
      })
      req.on('response', (resp)=>{
        if(resp.statusCode == 404){
          return reject(`服务器没有存储相关项目:${projectName}`)
        }
        if(resp.statusCode !== 200){
          return reject(new Error('http code ' + resp.statusCode))
        }
        fileHash = resp.headers['content-disposition'];
        file = _path.join(workspace, fileHash + ".tar");
        let fws =_fs.createWriteStream(file);
        resp.pipe(fws)
        resp.on('end', ()=>{
          resolve()
        })
      })
      req.on('error', (error)=>{reject(error)})
    })
  })()
  //获取文件hash值
  let md5 = await  _getMD5(file)

  //对比服务器端hash值
  console.log(md5, fileHash)
  if(md5 !== fileHash){
    throw new Error('文件下载错误，请重新下载！')
  }
  //解压文件并删除文件
  await (function(){return new Promise((resolve, rejct)=>{
    let result = _crossSpawn.sync("tar", ["-xf", `${fileHash}.tar`], {cwd: workspace, stdio: 'inherit' })
    if(result.status != 0){
      rejct(`解压失败，请手动解压文件 ${file} 到项目根目录`)
    }else{
      _fs.removeSync(_path.join(workspace, fileHash + ".tar"))
      resolve()
    }
  })})()
}
/* istanbul ignore next  */
export function commander(_commander){
  _commander.command('sync')
    .alias("download")
    .description('同步配置文件')
    .option('-w, --workspace <value>', '指定工作目录')
    .option('-u, --url <value>', '指定配置存储服务器地址')
    .option('-n, --projectName <value>', "指定同步的项目名称，可选，默认为 package.json => name")
    .option('-v, --projectVersion <value>', "指定同步的项目版本号， 可选，默认为 package.json => version")
    .action(async (program)=>{
        await sync(program);
        console.log('同步配置文件成功！请运行 sr install 安装插件。')
    })
  _commander.command('up')
    .alias("upload")
    .description('上传配置文件')
    .option('-w, --workspace <value>', '指定工作目录')
    .option('-u, --url <value>', '指定配置存储服务器地址')
    .option('-a, --all', "包括项目文件全部上传")
    .option('-n, --projectName <value>', "指定同步的项目名称，可选，默认为 package.json => name")
    .option('-v, --projectVersion <value>', "指定同步的项目版本号， 可选，默认为 package.json => version")
    .option('-l, --log <value>', 'log日志,( 0[defaul]: show all; 1: show error, fail; 2: show error, fail, warn)',(value)=>{_log.setLevel(value)})
    .action(async (program)=>{
      let result = await upload(program);
      console.log(`上传 ${result} 成功！`)
    })
}

