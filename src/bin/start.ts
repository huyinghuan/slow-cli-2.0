import * as _init from '../init'
import * as _projectUtils from '../lib/project'
import _app from '../app'
import * as _hook from '../hooks/index';

export default function(_commander){
  _commander.command('start')
    .description('启动http服务')
    .option('-p, --port <n>', '指定运行端口')
    .option('-c, --check', '检测运行版本，和插件版本')
    .action((program)=>{
      //读取用户自定义配置
      _init.prepareUserEnv();
      if(program.check){
        //检查cli 版本
        _projectUtils.checkCLIVersion();
        // 检查插件版本
        _projectUtils.checkPluginVersion();
      }
      //加载插件
      _hook.scanPlugins((error)=>{
        if(error){return}
        //静态域名接口
        if(program.port){
          (global as any).__CLI.port = program.port
        }
        _app()
      });
    
    })
}