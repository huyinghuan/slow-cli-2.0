
import * as _init from '../init/index';
import * as _project from '../project';
import * as _fse from 'fs-extra';

import _configFiledConstant from '../config-filed-constant';

function changeToDev(root, pluginConfig){
  let newPluginConfig =  {__root: root};
  Object.keys(pluginConfig).forEach((key)=>{
    if(key.indexOf('__') == 0){return}
    newPluginConfig[key] = {
      __stop: false,
      __source: key,
      __setting: pluginConfig[key]
    }
  })
  return newPluginConfig
}

function changeToProduction(pluginConfig){
  let newPluginConfig =  {};
  Object.keys(pluginConfig).forEach((key)=>{
    if(key.indexOf('__') == 0){return}
    newPluginConfig[key] =  pluginConfig[key].__setting
  })
  return newPluginConfig
}

export function execute(program){
  //读取用户自定义配置
  _init.prepareUserEnv(program.workspace);
  let packageJSON = _project.getProjectPackageJSON()
  let configFiledConstant = _configFiledConstant.get()
  let pluginConfig = packageJSON[configFiledConstant.pluginConfigField];
  let newPluginConfig = null;
  if(program.dev){
    if(!program.root){
      console.log("插件根目录未制定")
      return false
    }
    newPluginConfig = changeToDev(program.root, pluginConfig);
  }else{
    newPluginConfig = changeToProduction(pluginConfig)
  }
  packageJSON[configFiledConstant.pluginConfigField] = newPluginConfig;
  _fse.writeJSONSync(configFiledConstant.CLIConfigFile, packageJSON)
}

/* istanbul ignore next  */
export function commander(_commander){
  _commander.command('dev')
    .description('上传或者同步配置文件 up or sync ')
    .option('-w, --workspace <value>', '指定工作目录')
    .option('-d, --dev')
    .option('-n, --name <value>')
    .option('-r, --root <value>', "插件根目录")
    .action(execute)
}