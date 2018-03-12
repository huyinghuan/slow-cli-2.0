import * as _fs from 'fs'
import * as _path from 'path'
import * as _init from '../init/index'
import * as _project from '../project'
import * as _utils from '../plugin/index'
import * as _http from 'http'
import * as _https from 'https'
import * as _previewServer from '../preview-server'
import _extraParamsParse from './extraParamsParse'
import _log from '../lib/log';
import _configFiledConstant from '../config-filed-constant';
import _checkLatestCLIVersion from '../lib/checkLatestCLIVersion';
import _reportLog from '../lib/reportLog';
import * as _plugin from '../plugin/index'
import _unregisterHooks from '../hooks/unregisterHooks'

export function prepare(program){
  //读取用户自定义配置
  _init.prepareUserEnv(program.workspace);
  //读取运行时环境配置
  _init.prepareRuntimeEnv(program.enviroment || "production")
  _init.setRunType("preview")

  let viewDir = program.view || "prebuild";
  _configFiledConstant.setBuildParams({outdir: viewDir})
  //运行时参数记录
  let userInputArgs:any = {}

  if(program.port){
    userInputArgs.port = program.port
  }
  //设置用户自定义启动参数
  _configFiledConstant.setGlobal(userInputArgs)

  if(program.additional){
      _configFiledConstant.setGlobal(program.additional)
  }

  //检查启动参数是否合法
  if(!_init.checkStartArgs()){
    process.exit(1)
  };
  _checkLatestCLIVersion()
  if(program.check){
    //检查cli 版本
    // 检查插件版本
    if(!_utils.checkPluginVersion() || ! _project.checkCLIVersion()){
      process.exit(1)
    }
  }
}

/* istanbul ignore next  */
export function commander(_commander){
  _commander.command('preview')
    .description('启动http服务')
    .option('-w, --workspace <value>', '指定工作目录')
    .option('-v, --viewdir <value>', "指定view目录")
    .option('-p, --port <n>', '指定运行端口')
    .option('-c, --check', '检测运行版本，和插件版本')
    .option('-e, --enviroment <value>', "运行时环境可选[develop, production，或其他] 默认production")
    .option('-l, --log <value>', 'log日志,( 0[defaul]: show all; 1: show error, fail; 2: show error, fail, warn)',(value)=>{_log.setLevel(value)})
    .allowUnknownOption()
    .action((program)=>{
      prepare(program)
      let app = _previewServer.privewServer()
      let port = program.port || _configFiledConstant.getGlobal('port')
      _reportLog("start", "success")

      let server = _http.createServer(app)
      
      server.on('error', (error) => {
        if((error as any).code == 'EADDRINUSE'){
          console.log("端口冲突，请使用其它端口".red);
          return process.exit(1)
        }
        console.log(error);
        return process.exit(1)
      });
      console.log(`silky run on http://localhost:${port}`.green)
      server.listen(port);
    })
}

