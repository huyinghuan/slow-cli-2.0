import * as _init from '../init/index'
import * as _project from '../project'
import * as _utils from '../plugin/index';
import _app from '../app'
import _extraParamsParse from './extraParamsParse'
import _log from '../lib/log';

export default function(_commander){
  _commander.command('start')
    .description('启动http服务')
    .option('-p, --port <n>', '指定运行端口')
    .option('-c, --check', '检测运行版本，和插件版本')
    .option('-e, --enviroment <value>', "运行时环境可选[develop, production，或其他] 默认develop")
    .option('-l, --log <value>', 'log日志,( 0[defaul]: show all; 1: show error, fail; 2: show error, fail, warn)',(value)=>{_log.setLevel(value)})
    .option('-n, --noConfig', "无配置文件运行")
    .option('-A, --additional <items>', '额外的参数，格式 -A A=1[,B=xxx]', _extraParamsParse)
    .allowUnknownOption()
    .action((program)=>{
      //读取用户自定义配置
      _init.prepareUserEnv(program.noConfig);
      //读取运行时环境配置
      _init.prepareRuntimeEnv(program.enviroment)
      //运行时参数记录
      let userInputArgs:any = {}

      if(program.port){
        userInputArgs.port = program.port
      }
      //设置用户自定义启动参数
      _init.setStartParams(userInputArgs)

      if(program.additional){
         _init.setStartParams(program.additional)
      }
      
      //检查启动参数是否合法
      if(!_init.checkStartArgs()){
        process.exit(1)
      };

      if(program.check){
        //检查cli 版本
        // 检查插件版本
        if(!_utils.checkPluginVersion() || ! _project.checkCLIVersion()){
          process.exit(1)  
        } 
      }
      //启动http服务
      _app()
    
  })
}