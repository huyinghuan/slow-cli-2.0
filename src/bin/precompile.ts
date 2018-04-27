import * as _fs from 'fs'
import * as _path from 'path'
import * as _init from '../init/index'
import * as _cli from '../cli'
import * as _utils from '../plugin/index'
import * as _http from 'http'
import * as _https from 'https'
import _extraParamsParse from './extraParamsParse'
import _log from '../lib/log';
import _configFiledConstant from '../config-filed-constant';
import _reportLog from '../lib/reportLog';
import * as _plugin from '../plugin/index'
import _unregisterHooks from '../hooks/unregisterHooks'
import * as _precompile from '../precompile'
export function prepare(program){
  //读取用户自定义配置
  _init.prepareUserEnv(program.workspace);
  //读取运行时环境配置
  _init.prepareRuntimeEnv(program.enviroment || "production")
  _init.setRunType("precompile")
  let outdir =  program.outdir || "prebuild"
  _configFiledConstant.setBuildParams({outdir: outdir})
  _init.addBuildIgnore(outdir)
  //检查启动参数是否合法
  if(!_init.checkStartArgs()){
    process.exit(1)
  };
  _cli.checkLatestVersion()
  if(program.check){
    //检查cli 版本
    // 检查插件版本
    if(!_utils.checkPluginVersion() || ! _cli.checkVersion()){
      process.exit(1)
    }
  }
}

/* istanbul ignore next  */
export function commander(_commander){
  _commander.command('precompile')
    .alias("prebuild")
    .description('启动预编译')
    .option('-w, --workspace <value>', '指定工作目录')
    .option('-o, --outdir', '预编译输出路径')
    .option('-e, --enviroment <value>', "运行时环境可选[develop, production，或其他] 默认production")
    .option('-l, --log <value>', 'log日志,( 0[defaul]: show all; 1: show error, fail; 2: show error, fail, warn)',(value)=>{_log.setLevel(value)})
    .allowUnknownOption()
    .action((program)=>{
      prepare(program)
      _precompile.compile()
    })
}

