import _extraParamsParse from './extraParamsParse'
import _log from '../lib/log';
import * as _initUtils from '../init/index';
import * as _plugin from '../plugin/index';
import * as _ from 'lodash';
import * as _project from '../project';
import * as _init from '../init/index'

import _configFiledConstant from '../config-filed-constant';
import * as _commander from 'commander';
import { plugin } from '../hooks/map';
import * as _path from 'path';

const padding = function(str, length){
  if(str.length >= length){
    return str
  }
  return str + (new Array(length - str.length)).join(" ")
}

export function execute(plugins, program, finish){
  //读取用户自定义配置
  _init.prepareUserEnv(program.workspace);

  let packageJSON = _project.getProjectPackageJSON();
  let saveAsProduct = program.save
  if(plugins.length){ //指定了插件名称就安装插件
    //写入到package.json
    _plugin.install(plugins, program.registry, saveAsProduct, (error, installSuccessPlugnList)=>{
      let pluginConfig = {}
      installSuccessPlugnList.forEach((pluginName)=>{
        pluginName = _plugin.getFullPluginName(pluginName, false)
        pluginConfig[pluginName] = _plugin.getPluginConfig(pluginName)
      })
      _plugin.writePluginConfigToConfigFile(pluginConfig)
      finish(error)
    })
    return
  }
  //没有指定，安装所有
  let pluginConfig = _configFiledConstant.getPluginConfig();
  let pluginNameArr = [];
  let versionDependencies = _.extend({}, _project.getProjectPackageJSONField('devDependencies'),_project.getProjectPackageJSONField('dependencies'))

  Object.keys(pluginConfig).forEach((key)=>{
    if(pluginConfig[key] == false){
      _log.info(`插件 ${padding(key, 20)} 已被禁用， 跳过安装`.red)
      return;
    }

    if(_.isPlainObject(pluginConfig[key]) && pluginConfig[key].__source){
      _log.info(`插件 ${padding(key, 20)} 处于开发中模式， 跳过安装`.yellow);
      return
    }
    let version = versionDependencies[_plugin.getFullPluginName(key, false)];
    let hadInstalledVersion = _plugin.getInstalledPluginVersion(_plugin.getFullPluginName(key, false));
    let pluginType = "插件"
    if(key.indexOf("sp-")==-1){
      pluginType = "组件"
    }
    if(version == hadInstalledVersion && !program.force && !program.newest){
      return console.log(`${pluginType} ${padding(key, 20)} 版本 ${version} [✔]`.green)
    }
    if(program.newest){
      version = "latest"
    }
    //获取依赖的版本,如果有依赖版本则安装依赖版本
    if(versionDependencies[_plugin.getFullPluginName(key, false)]){
      key = `${key}@${version}`
    }
    pluginNameArr.push(key)
  })
  if(pluginNameArr.length == 0){
    return console.log('所有依赖已全部安装。')
  }
  _plugin.install(pluginNameArr, program.registry, saveAsProduct, finish)
}
/* istanbul ignore next  */
export function commander(_commander){
  _commander.command('install [plugins...]')
    .description('安装插件')
    .option('-w, --workspace <value>', '指定工作目录')
    .option('-n, --newest', "更新插件到最新版本")
    .option('-l, --log <value>', 'log日志,( 0[defaul]: show all; 1: show error, fail; 2: show error, fail, warn)',(value)=>{_log.setLevel(value)})
    .option('-f, --force', '强制重新安装')
    .option('-r, --registry <value>',  "指定插件的仓库地址")
    .option('-s, --save', '以产品模式安装插件，用于开发js css lib 库')
    .action((plugins, program)=>{
      execute(plugins, program,  (error)=>{
        if(error){
          _log.error(error);
        }else{
          _log.success("安装插件完成！".green)
        }
        
      })
    })

  _commander.command('uninstall [plugins...]')
    .alias("remove")
    .action((plugins, program)=>{
      plugins.forEach((pluginName) => {
        _plugin.removePluginConfig(pluginName)
      });
    })
}