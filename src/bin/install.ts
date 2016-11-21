import _extraParamsParse from './extraParamsParse'
import _log from '../lib/log';
import {executeCommand as _executeCommand}  from '../hooks/utils';
import * as _initUtils from '../init/index';
import * as _plugin from '../plugin/index'

export default function(_commander){
  _commander.command('install [plugins...]')
    .description('安装插件')
    .option('-l, --log <value>', 'log日志,( 0[defaul]: show all; 1: show error, fail; 2: show error, fail, warn)',(value)=>{_log.setLevel(value)})
    .option('-A, --additional <items>', '额外的参数，格式 -A A=1[,B=xxx]', _extraParamsParse)
    .option('-p, --pluginListName <value>', '根据插件列表名称获取插件列表')
    .action((plugins, program)=>{

      console.log(plugins)

      let queue = [];
      let pluginConfig = {}
      plugins.forEach((pluginName)=>{
        pluginConfig[_plugin.getFullPluginName(pluginName)] = {}
      })

      if(program.pluginListName){
        queue.push(()=>{
          _initUtils.getRemoteServerProjectPluginConfig(program.pluginListName, (pluginConfig)=>{
            
          })
        })
        
      }


    })
}