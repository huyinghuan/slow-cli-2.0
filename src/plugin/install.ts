
import * as _async from 'async';
import * as _init from '../init/index';
import _executeCommand from '../lib/executeCommand';
import _log from '../lib/log';
import _getFullPluginName from './getFullPluginName';

const _registry = "http://npm.hunantv.com";

function installPlugin(pluginName, cb){
  let registry = _init.getProjectPackageJSONField('__registry') || _registry
  pluginName  = _getFullPluginName(pluginName, true)
  console.log(`npm install ${pluginName}  --save --save-exact --registry ${registry}`)
  _executeCommand(`npm install ${pluginName} --save --save-exact --registry ${registry}`, (error)=>{
    if(error){
      cb(`安装插件${pluginName}失败`.red)
    }else{
      _log.success(`安装插件${pluginName}成功`.green)
      cb(null)
    }
  })
}

export default function(pluginList){
  let beInstallPluginList = [];
  pluginList.forEach((pluginName)=>{
    beInstallPluginList.push(_getFullPluginName(pluginName, true))
  })

  installPlugin(beInstallPluginList.join(' '),  (error)=>{
    if(error){
      _log.error(error);
    }
    _log.success("安装插件完成！".green)
  })
}