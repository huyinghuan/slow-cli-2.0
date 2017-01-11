
import * as _async from 'async';
import * as _project from '../project';
import _executeCommand from '../lib/executeCommand';
import _log from '../lib/log';
import _getFullPluginName from './getFullPluginName';
import _configFiledConstant from '../config-filed-constant';
const _registry = "http://npm.hunantv.com";

function installPlugin(pluginName, registry, cb){
  if(registry == "taobao"){
    registry = "https://registry.npm.taobao.org"
  }
  registry = registry || _project.getProjectPackageJSONField('__registry') || _registry;
  console.log(`npm install ${pluginName}  --save --save-exact --registry ${registry}`)
  _executeCommand(`npm install ${pluginName} --save --save-exact --registry ${registry}`, {cwd: _configFiledConstant.getWorkspace()}, (error)=>{
    if(error){
      cb(`安装插件${pluginName}失败`.red)
      cb(error)
    }else{
      _log.success(`安装插件${pluginName}成功`.green)
      cb(null)
    }
  })
}

export default function(pluginList, registry, finish){
  let beInstallPluginList = [];
  pluginList.forEach((pluginName)=>{
    beInstallPluginList.push(_getFullPluginName(pluginName, true))
  })

  installPlugin(beInstallPluginList.join(' '), registry, finish)
}

