import * as _init from '../init'
import * as _projectUtils from '../lib/project';
import * as _plugin from '../plugin/index';

export default function(_commander){
  _commander.command('check')
    .description('检查版本信息和插件信息')
    .option('-f, --fix', '修复相关配置文件')
    .option('-u, --update', '自动升级cli 和 相关插件')
    .action((program)=>{
      //读取用户自定义配置
      _init.prepareUserEnv();
      //检查cli 版本
      _projectUtils.checkCLIVersion();
      // 检查插件版本
      _plugin.checkPluginVersion();
      
      if(program.fix){
        // TODO
      }

      if(program.update){
        // TODO
      }

    })
}