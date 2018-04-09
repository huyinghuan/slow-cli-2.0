import * as _ from 'lodash';
import _registerHook from '../hooks/registerHook';
import _registerHookExt from '../hooks/registerHookExt';
import * as _utils from '../hooks/utils';
import * as _allDefined from '../all';
import _log from '../lib/log';
import * as _hookMap from '../hooks/map';
import * as _runtime from '../runtime-enviroment/index';
import _configFiledConstant from '../config-filed-constant';
import * as _path from 'path'
import * as _fs from 'fs'
import * as _cli from '../cli'
import * as _project from '../project'
import _getGitHash from '../lib/getGitHash';
const versionDesc = _cli.getVersion();

function registerHook(hookType: string, pluginName: string){
  return (hookList:any, callback:_allDefined.CallBack, priority?:number)=>{
    hookList = [].concat(hookList)
    for(let i = 0; i <  hookList.length; i++){
      let hookName = hookList[i]
      if(hookName.indexOf(hookType) == 0 || hookType == 'all'){
        priority = ~~priority != 0 ? ~~priority : 1;
        _registerHook(hookName, callback, priority);
        if(pluginName){
          _log.success(`加载插件${pluginName}'s hook  ${hookName} 成功! priority:${priority}`.blue)
        }
        return
      }
    }
  }
}

function getWorkspace(){
  return _configFiledConstant.getWorkspace()
}

function getPublicLibIndex(moduleName){
  let moduleRootAbsolute = _path.join(_configFiledConstant.getWorkspace(),  getPublicLibDir(moduleName))
  let packageJSON = require(_path.join(moduleRootAbsolute, "package.json"));
  let index = packageJSON.main
  if(index){
    return index
  }
  let files = _fs.readdirSync(moduleRootAbsolute)
  for(let i = 0, len = files.length; i < len; i++){
    if(/^index\./.test(files[i])){
      index = files[i]
      break
    }
  }
  return index
}

function getPublicLibDir(moduleName){
  //查看改module是否存在于正式插件配置中， 如果存在，那么不是开发状态的组件，使用 node_modules默认组件目录 ，如果不存在，在去读取，组件的自定义目录配置。
  let pubModulesDir = ""
  if(_fs.existsSync(_path.join(_configFiledConstant.getWorkspace(), "node_modules", moduleName))){
    pubModulesDir = "node_modules"
  }else{
    pubModulesDir = _configFiledConstant.getGlobal().pubModulesDir
  }
  return _path.join(pubModulesDir, moduleName)
}

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
        version: versionDesc, //silky 版本
        projectName: _project.getProjectPackageJSONField('name'),
        projectVersion: _project.getProjectPackageJSONField('version'),
        projectHash: _getGitHash(),
        registerHook: registerHook(hookType, pluginName),
        ext: _hookMap.HookExtQueue,
        options: _configFiledConstant.getGlobal(),
        utils: _utils, //一些默认工具函数，大多插件可以使用得到
        log: _log,
        cwd: getWorkspace,
        getPublicLibIndex: getPublicLibIndex,
        getPublicLibDir: getPublicLibDir,
        runtime: _runtime
      }, options)
    }

    if(_.isFunction(plugin.registerPluginExt)){
      plugin.registerPluginExt({
        registerExt: (extName, fn)=>{
          _registerHookExt(extName, fn)
          _log.success(`加载插件扩展 ${extName} 成功`.blue)
        },
        options: _configFiledConstant.getGlobal(),
        utils: _utils, //一些默认工具函数，大多插件可以使用得到
        log: _log,
        cwd: getWorkspace,
      }, options)
    }

  } catch (error) {
    _log.fail(error)
    _log.error(`加载插件 ${pluginName} 失败`.red)
    process.exit(1)
  }
}