import * as _ from 'lodash';
import _registerHook from '../hooks/registerHook';
import * as _utils from '../hooks/utils';
import * as _init from '../init/index';
import * as _allDefined from '../all';
import _log from '../lib/log';
/**
 * 加载指定类型hooks
 * hookType  hook类型，如start只用到了route 类型， build只用了build类型， 加载所有用 all
 * pluginName 插件名字
 * pluginPath 插件路径
 * option 插件配置
 * cb 回调函数
 *  */
export default function loadPlugin(hookType:string, pluginName:string, pluginPath:string, options:any, cb){
  try {
    let plugin = require(pluginPath);
    //默认权重
    if(_.isFunction(plugin.registerPlugin)){
      plugin.registerPlugin({
        registerHook: (hookName:string, callback:_allDefined.CallBack, priority?:number)=>{
          if(hookName.indexOf(hookType) == 0 || hookType == 'all'){
            _registerHook(hookName, callback, priority);
            _log.success(`加载插件${pluginName}'s hook ${hookName} 成功`.blue)
            return
          }
        },
        options: _init.getFullConfig(),
        utils: _utils //一些默认工具函数，大多插件可以使用得到
      }, options)
    }
    cb(null)
  } catch (error) {
    _log.fail(error)
    _log.success(`加载插件 ${pluginName} 失败, 缺少注册函数`.red)
    cb(error)
  }
}