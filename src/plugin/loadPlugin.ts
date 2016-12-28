import * as _ from 'lodash';
import _registerHook from '../hooks/registerHook';
import _registerHookExt from '../hooks/registerHookExt';
import * as _utils from '../hooks/utils';
import * as _init from '../init/index';
import * as _allDefined from '../all';
import _log from '../lib/log';
import * as _hookMap from '../hooks/map';
import * as _runtime from '../runtime-enviroment/index';
import _configFiledConstant from '../config-filed-constant';
/**
 * 加载指定类型hooks
 * hookType  hook类型，如start只用到了route 类型， build只用了build类型， 加载所有用 all
 * pluginName 插件名字
 * pluginPath 插件路径
 * option 插件配置
 *  */
export default function loadPlugin(hookType:string, pluginName:string, pluginPath:string, options:any){
  try {
    if(_.isPlainObject(options)){
      if(options.__stop){
        _log.warn(`禁用插件${pluginName}`.red)
        return
      }
      if(options.__source){
        options = options.__setting;
      }
    }
    let plugin = require(pluginPath);
    //默认权重 加载插件
    if(_.isFunction(plugin.registerPlugin)){
      plugin.registerPlugin({
        registerHook: (hookName:string, callback:_allDefined.CallBack, priority?:number)=>{
          if(hookName.indexOf(hookType) == 0 || hookType == 'all'){
            priority = ~~priority > 0 ? ~~priority : 1;
            _registerHook(hookName, callback, priority);
            if(pluginName){
              _log.success(`加载插件${pluginName}'s hook  ${hookName} 成功! priority:${priority}`.blue)
            }
            return
          }
        },
        ext: _hookMap.HookExtQueue,
        options: _init.getFullConfig(),
        utils: _utils, //一些默认工具函数，大多插件可以使用得到
        log: _log,
        cwd: ()=>{return _configFiledConstant.getWorkspace()},
        runtime: _runtime
      }, options)
    }

    if(_.isFunction(plugin.registerPluginExt)){
      plugin.registerPluginExt({
        registerExt: (extName, fn)=>{
          _registerHookExt(extName, fn)
          _log.success(`加载插件扩展 ${extName} 成功`.blue)
        },
        options: _init.getFullConfig(),
        utils: _utils, //一些默认工具函数，大多插件可以使用得到
        log: _log,
        cwd: cwd
      }, options)
    }

  } catch (error) {
    _log.fail(error)
    _log.success(`加载插件 ${pluginName} 失败`.red)
    process.exit(1)
  }
}