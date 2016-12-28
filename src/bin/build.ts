import * as _init from '../init/index'
import * as _build from '../build/index';
import * as _project from '../project';
import * as _plugin from '../plugin/index'
import * as _path from 'path';
import _extraParamsParse from './extraParamsParse';
import _log from '../lib/log'


export function execute(program){
  //读取用户自定义配置
  _init.prepareUserEnv(program.workspace);

  _init.prepareRuntimeEnv(program.enviroment || "production")
  //build 强制进行版本检查
  let checkResult = _project.checkCLIVersion() && _plugin.checkPluginVersion();

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
  if(program.httpServer){
    _build.buildServer(program.port || 14423)
  }else{
    _build.buildProcess()
  }
}

export function commander(_commander){
  _commander.command('build')
    .description('编译')
    .option('-w, --workspace <value>', '指定工作目录')
    .option('-o, --outdir <value>', '指定build文件夹')
    .option('-f, --force', '强制进行build，哪怕版本检查没通过')
    .option('-e, --enviroment <value>', "运行时环境可选[develop, production，或其他] 默认production")
    .option('-l, --log <value>', 'log日志,( 0[defaul]: show all; 1: show error, fail; 2: show error, fail, warn)',(value)=>{_log.setLevel(value)})
    .option('-A, --additional <items>', '额外的参数，格式 -A A=1[,B=xxx] 或者指定唯一值  -A value', _extraParamsParse)
    .option('-h, --httpServer', '作为http server启动')
    .option('-p, --port <value>', '仅当存在-h选项时，该配置起作用，用来指定http server端口，默认为 14423')
    .allowUnknownOption()
    .action(execute)
}

