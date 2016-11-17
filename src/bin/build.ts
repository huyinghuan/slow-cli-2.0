import * as _init from '../init/index'
import _build from '../build';
import * as _projectUtils from '../lib/project';
import * as _plugin from '../plugin/index' 
import * as _path from 'path';
import _extraParamsParse from './extraParamsParse';
import _log from '../lib/log'

export default function(_commander){
  _commander.command('build')
    .description('编译')
    .option('-o, --outdir <value>', '指定build文件夹')
    .option('-f, --force', '强制进行build，哪怕版本检查没通过')
    .option('-l, --log <value>', 'log日志,( 0[defaul]: show all; 1: show error, fail; 2: show error, fail, warn)',(value)=>{_log.setLevel(value)})
    .option('-A, --additional <items>', '额外的参数，格式 -A A=1[,B=xxx]', _extraParamsParse)
    .action((program)=>{
      //读取用户自定义配置
      _init.prepareUserEnv();

      //build 强制进行版本检查
      let checkResult = _projectUtils.checkCLIVersion() && _plugin.checkPluginVersion();

      //如没有强制build项目，那么如果版本检查没通过则结束build
      if(!program.force && !checkResult){
        process.exit(1);
      }
      //运行时参数记录
      let userInputArgs:any = {}

      //制定编译输出目录
      if(program.outdir){
        userInputArgs.outdir = program.outdir
      }

      //更新全局变量下的编译参数。
      _init.setBuildParams(userInputArgs)
      
      if(program.additional){
         _init.setBuildParams(program.additional)
      }

      //检查编译参数
      if(!_init.checkBuildArgs()){
        return process.exit(1)
      }
      _build()
    })
}