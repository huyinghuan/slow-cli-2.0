
import * as _async from 'async';
import * as _project from '../project';
import _executeCommand from '../lib/executeCommand';
import * as _spawn from 'cross-spawn'
import _log from '../lib/log';
import _getFullPluginName from './getFullPluginName';
import _configFiledConstant from '../config-filed-constant';
const _registry = "http://npm.hunantv.com";

function installPlugin(beInstallPluginList, registry, saveAsProduct, cb){
  if(registry == "taobao"){
    registry = "https://registry.npm.taobao.org"
  }
  let saveInfo = ["--save-dev","--save-exact"]
  if(saveAsProduct){
    saveInfo = ["--save", "--save-exact"]
  }
  registry = registry || _project.getProjectPackageJSONField('__registry') || _registry;
  var argvs = ["install", "--registry", registry].concat(beInstallPluginList).concat(saveInfo)
  let child = _spawn('npm', argvs, { stdio: 'inherit' })
  child.on('exit', function (code) {
      console.log(code)
      if(code == 0){
        _log.success(`安装插件${beInstallPluginList}成功`.green)
        cb(null)
      }else{
        cb(`安装插件${beInstallPluginList}失败`.red)
      }
      
  });
  child.on('error', function(e){
    console.log(e)
    cb(`安装插件${beInstallPluginList}失败`.red)
  })
}

export default function(pluginList, registry, saveAsDev, finish){
  let beInstallPluginList = [];
  pluginList.forEach((pluginName)=>{
    beInstallPluginList.push(_getFullPluginName(pluginName, true))
  })

  installPlugin(beInstallPluginList, registry, saveAsDev, finish)
}

