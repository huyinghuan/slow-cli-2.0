import * as _init from '../init'
import _app from '../app'
import * as _hook from '../hooks/index';

export default function(_commander){
  _commander.command('start')
    .description('启动http服务')
    .option('-p, --port <n>', '指定运行端口')
    .action((program)=>{
      //读取用户自定义配置
      _init.prepareUserEnv();
      //TODO: 检查cli 版本
      //TODO: 检查插件版本
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