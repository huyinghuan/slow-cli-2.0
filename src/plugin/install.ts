
import * as _async from 'async';
import * as _init from '../init/index';
import _executeCommand from '../lib/executeCommand';
import _log from '../lib/log';
import _getFullPluginName from './getFullPluginName';

const _registry = "http://npm.hunantv.com";

function installPlugin(pluginName, cb){
  pluginName  = _getFullPluginName(pluginName, true)
  _executeCommand(`npm install ${pluginName} --save`, (error)=>{
    if(error){
      cb(`安装插件${pluginName}失败`.red)
    }else{
      _log.success(`安装插件${pluginName}成功`.green)
      cb(null)
    }
  })
}

export default function(pluginList){
  let registry = _init.getProjectPackageJSONField('__registry')
  _async.map(pluginList, installPlugin, (error)=>{
    if(error){
      _log.error(error);
    }
    _log.success("安装插件完成！".green)
  })
}