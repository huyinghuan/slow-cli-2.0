import _extraParamsParse from './extraParamsParse'
import _log from '../lib/log';
export default function(_commander){
  _commander.command('install <plugin> [plugins...]')
    .description('安装插件')
    .option('-l, --log <value>', 'log日志,( 0[defaul]: show all; 1: show error, fail; 2: show error, fail, warn)',(value)=>{_log.setLevel(value)})
    .option('-A, --additional <items>', '额外的参数，格式 -A A=1[,B=xxx]', _extraParamsParse)
    .action((program, plugin, plugins)=>{
      console.log(program, plugin, plugins)
    })
}