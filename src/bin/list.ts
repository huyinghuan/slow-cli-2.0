import * as _init from '../init'
import * as _project from '../project';
import * as _plugin from '../plugin/index';
import * as _ from 'lodash';
import _preparePrerequisiteDir from '../init/preparePrerequisiteDir'
import _configFiledConstant from '../config-filed-constant';
import padding from '../lib/padding'
import _log from '../lib/log';

export function execute(program){
  //读取用户自定义配置
  _init.prepareUserEnv(program.workspace);
  //检查cli 版本
  _project.checkCLIVersion();
  //没有指定，安装所有
  let pluginConfig = _configFiledConstant.getPluginConfig();
  let pluginNameArr = [];
  let versionDependencies = _.extend({}, _project.getProjectPackageJSONField('devDependencies'),_project.getProjectPackageJSONField('dependencies'))
  _log.info(`[ ] Type ${padding("Name", 20)} ${padding("Dependency", 12)} Installed`.green)
  _log.info(`---------------------------------------------------`.green)
  Object.keys(pluginConfig).forEach((key)=>{
    if(pluginConfig[key] == false){
      _log.info(`插件 ${padding(key, 20)} 已被禁用`.red)
      return;
    }

    if(_.isPlainObject(pluginConfig[key]) && pluginConfig[key].__source){
      _log.info(`插件 ${padding(key, 20)} 处于开发中模式`.yellow);
      return
    }
    let version = versionDependencies[_plugin.getFullPluginName(key, false)];
    let hadInstalledVersion = _plugin.getInstalledPluginVersion(_plugin.getFullPluginName(key, false));
    let pluginType = "插件"
    if(key.indexOf("sp-")==-1){
      pluginType = "组件"
    }
    if(version == hadInstalledVersion){
      _log.info(`[✔] ${pluginType} ${padding(key, 20)} ${padding(version, 12)}`.green)
    }else{
      _log.info(`[x] ${pluginType} ${padding(key, 20)} ${padding(version, 12)} ${hadInstalledVersion}`.red)
    }
  })
 
}
/* istanbul ignore next  */
export function commander(_commander){
  _commander.command('list')
    .description('检查版本信息和插件信息')
    .option('-w, --workspace <value>', '指定工作目录')
    .action(execute)
}