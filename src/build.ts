import * as _init from './init/index';
import * as _hook from './hooks/index';
import * as _hookMap from './hooks/map';
import * as _async from 'async';
import _getAllFileInDir from './lib/getAllFileInDir';

const _workspace = process.cwd();

function shouldInclude(filename, filepath){
  const _buildConfig = _init.getBuildConfig();
  //需要忽略掉文件
  const buildIgnore:Array<string> = _buildConfig.ignore;

}

function normalExecute(){
 
  let queue = [];
  //获取所有待编译文件
  _getAllFileInDir(_workspace, [], shouldInclude)
}

export default function(){
  let queue = [];
  //加载插件
  queue.push((cb)=>{
    _hook.scanPlugins('build', cb)
  });

  //build初始化HOOK
  queue.push((cb)=>{_hook.triggerBuildInitHook(cb);});

  _async.waterfall(queue, (error, stop)=>{
    if(error){
      console.log(error);
      console.log('build 初始化失败'.red);
      _hook.triggerBuildErrorHooks(error);
      return;
    }
    if(stop){return}
    normalExecute()
  })
}