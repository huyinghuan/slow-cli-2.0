import _extraParamsParse from './extraParamsParse'
import _log from '../lib/log';
import * as _initUtils from '../init/index';
import * as _plugin from '../plugin/index';

export default function(_commander){
  _commander.command('install [plugins...]')
    .description('安装插件')
    .option('-l, --log <value>', 'log日志,( 0[defaul]: show all; 1: show error, fail; 2: show error, fail, warn)',(value)=>{_log.setLevel(value)})
    .option('-A, --additional <items>', '额外的参数，格式 -A A=1[,B=xxx]', _extraParamsParse)
    .option('-p, --pluginListName <value>', '根据插件列表名称获取插件列表')
    .action((plugins, program)=>{

      _initUtils.prepareUserEnv();
      let packageJSON = _initUtils.getProjectPackageJSON();
      //如果指定了项目
      if(program.pluginListName){
        _initUtils.getRemoteServerProjectPluginConfig(program.pluginListName, (pluginConfig)=>{
          _initUtils.writePluginConfigToConfigFile(pluginConfig)
          _plugin.install(Object.keys(pluginConfig))
        })
      }else if(plugins.length){ //指定了插件名称就安装插件
        //写入到package.json
        let pluginConfig = {}
        plugins.forEach((pluginName)=>{
          pluginConfig[_plugin.getFullPluginName(pluginName)] = {}
        })
        _initUtils.writePluginConfigToConfigFile(pluginConfig)
        _plugin.install(plugins)
      }else{ //没有指定，安装所有
        _plugin.install(Object.keys(_initUtils.getPluginConfig()))
      }
    })
}