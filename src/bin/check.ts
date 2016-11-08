import * as _init from '../init'
import * as _projectUtils from '../lib/project'

export default function(_commander){
  _commander.command('check')
    .description('检查版本信息和插件信息')
    .action((program)=>{
      //读取用户自定义配置
      _init.prepareUserEnv();
      //检查cli 版本
      _projectUtils.checkCLIVersion();
      // 检查插件版本
      _projectUtils.checkPluginVersion();
    
    })
}