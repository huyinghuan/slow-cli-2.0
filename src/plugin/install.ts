
import * as _async from 'async';
import * as _project from '../project';
import _executeCommand from '../lib/executeCommand';
import * as _spawn from 'cross-spawn'
import _log from '../lib/log';
import _getFullPluginName from './getFullPluginName';
import _configFiledConstant from '../config-filed-constant';
import _publicConfig from '../public'

function installPlugin(beInstallPluginList, registry, saveAsProduct, cb){
  if(registry == "taobao"){
    registry = "https://registry.npm.taobao.org"
  }
  if(registry == "npm"){
    registry = "https://registry.npmjs.com/"
  }

  registry = registry || _project.getProjectPackageJSONField('__registry') || _publicConfig.private_npm_registry;
  let installSuccessPlugnList  = []
  let installFailPlugnList  = []
  _async.mapSeries(beInstallPluginList, (pluginName, doNext)=>{
    let saveInfo = ["--save-dev","--save-exact"]
    //所有非内容处理插件（即不以sp-开始的库，全部保存到正式依赖）
    if((pluginName as string).indexOf("sp-") != 0 || saveAsProduct){
      saveInfo = ["--save", "--save-exact"]
    }
    let child = _spawn('npm', ["install", "--registry", registry].concat(pluginName).concat(saveInfo), { stdio: 'inherit' })
    child.on('exit', function (code) {
        if(code == 0){
          _log.success(`安装插件${pluginName}成功`.green)
          installSuccessPlugnList.push(pluginName)
          doNext(null, null)
        }else{
          installFailPlugnList.push(pluginName)
          doNext(null, null)
        }
    });
    child.on('error', function(e){
      console.log(e)
      installFailPlugnList.push(pluginName)
      doNext(null, null)
    })
  }, (err)=>{
    if(installSuccessPlugnList.length > 1){
      _log.success(`\n安装插件${installSuccessPlugnList}成功`.green)
    }
    if(installFailPlugnList.length){
      cb(`\n安装插件${installFailPlugnList}失败`.red, installSuccessPlugnList)
    }else{
      cb(null, installSuccessPlugnList)
    }
  })
}

export default function(pluginList, registry, saveAsProduct, finish){
  let beInstallPluginList = [];
  pluginList.forEach((pluginName)=>{
    beInstallPluginList.push(_getFullPluginName(pluginName, true))
  })

  installPlugin(beInstallPluginList, registry, saveAsProduct, finish)
}

