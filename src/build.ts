
import * as _hook from './hooks/index';
import * as _hookMap from './hooks/map';
import * as _async from 'async';

function normalExecute(){
  let queue = [];
  //获取所有待编译文件
  
}

export default function(){
  let queue = [];
  //加载插件
  queue.push((cb)=>{
    _hook.scanPlugins(cb)
  });

  //build初始化插件
  queue.push((cb)=>{
    _hook.triggerBuildInitHook((error, stop)=>{
      cb(error, stop)
    })
  });

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