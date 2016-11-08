import * as _init from '../init/index'
import _build from '../build';
import * as _projectUtils from '../lib/project';

export default function(_commander){
  _commander.command('build')
    .description('编译')
    .option('-o, --outdir <value>', '指定build文件夹')
    .option('-f, --force', '强制进行build，哪怕版本检查没通过')
    .action((program)=>{
      //读取用户自定义配置
      _init.prepareUserEnv();

      //build 强制进行版本检查
      let checkResult = _projectUtils.checkCLIVersion() && _projectUtils.checkPluginVersion();

      //如没有强制build项目，那么如果版本检查没通过则结束build
      if(!program.force && !checkResult){
        process.exit(1);
      }
      
      _build()
    })
}