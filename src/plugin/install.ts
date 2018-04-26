import * as _project from '../project';
import _executeCommand from '../lib/executeCommand';
import * as _spawn from 'cross-spawn'
import _log from '../lib/log';
import _getFullPluginName from './getFullPluginName';
import _configFiledConstant from '../config-filed-constant';
import _publicConfig from '../public'
import * as _ from 'lodash'

function logSuccessInfo(installSuccessPlugnList: Array<string>){
    let versionDependencies = _.extend({}, _project.getProjectPackageJSONField('devDependencies'),_project.getProjectPackageJSONField('dependencies'))
    _log.success(`\n已成功安装插件:`.yellow)
    installSuccessPlugnList.forEach((pluginNameAndVersion:string)=>{
      let pluginName = pluginNameAndVersion.replace(/\@.+$/, "")
      _log.success(`  ${pluginName}@${versionDependencies[pluginName]}`.yellow)
    })
}

function npmInstall(registry, pluginName ){
  return new Promise((reslove, reject)=>{
    let child = _spawn('npm', ["install", "--registry", registry].concat(pluginName).concat(["--save","--save-exact"]), { stdio: 'inherit' })
    child.on('exit', function (code) {
      if(code == 0){
        _log.success(`安装插件${pluginName}成功`.green)
        reslove(true)
      }else{
        reslove(false)
      }
    });
    child.on('error', function(e){
      reject(e)
    })
  })
}

async function installPlugin(beInstallPluginList, registry){
  if(registry == "taobao"){
    registry = "https://registry.npm.taobao.org"
  }
  if(registry == "npm"){
    registry = "https://registry.npmjs.com/"
  }

  registry = registry || _project.getProjectPackageJSONField('__registry') || _publicConfig.private_npm_registry;
  let installSuccessPlugnList  = []
  let installFailPlugnList  = []

  beInstallPluginList.forEach(async (pluginName)=> {
    if((pluginName as string).indexOf('@') == -1){
      pluginName = pluginName+"@latest"
    }
    let success = await npmInstall(registry, pluginName)
    if(success){
      installSuccessPlugnList.push(pluginName)
    }else{
      installFailPlugnList.push(pluginName)
    }
  });

  if(installSuccessPlugnList.length > 1){
    logSuccessInfo(installSuccessPlugnList)
  }
  if(installFailPlugnList.length){
    return {
      err: `\n安装插件${installFailPlugnList}失败`,
      list: installSuccessPlugnList
    }
  }
  return {
    list: installSuccessPlugnList
  }
}

export default async function(pluginList, registry){
  let beInstallPluginList = [];
  pluginList.forEach((pluginName)=>{
    beInstallPluginList.push(_getFullPluginName(pluginName, true))
  })

  return installPlugin(beInstallPluginList, registry)
}

