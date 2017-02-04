"use strict";
/*
export function execute(modules, program, finish){
  //读取用户自定义配置
  _init.prepareUserEnv(program.workspace);

  if(modules.length){ //指定了插件名称就安装插件
    //写入到package.json
    let moduleConfig = {}

    _plugin.writePluginConfigToConfigFile(pluginConfig)
    _plugin.install(plugins, program.registry, finish)
    return
  }

  let packageJSON = _project.getProjectPackageJSON();
  //没有指定，安装所有
  let pluginConfig = _configFiledConstant.getPluginConfig();
  let pluginNameArr = [];
  let versionDependencies = _project.getProjectPackageJSONField('dependencies')

  Object.keys(pluginConfig).forEach((key)=>{
    if(pluginConfig[key] == false){
      _log.info(`插件${key}已被禁用， 跳过安装`)
      return;
    }

    if(_.isPlainObject(pluginConfig[key]) && pluginConfig[key].__source){
      _log.info(`插件${key}处于开发中模式， 跳过安装`);
      return
    }
    let version = versionDependencies[_plugin.getFullPluginName(key, false)];
    let hadInstalledVersion = _plugin.getInstalledPluginVersion(_plugin.getFullPluginName(key, false));
    if(version == hadInstalledVersion && !program.force){
      return console.log(`插件${key}已安装规定版本${version}`)
    }
    //获取依赖的版本,如果有依赖版本则安装依赖版本
    if(versionDependencies[_plugin.getFullPluginName(key, false)]){
      key = `${key}@${version}`
    }
    pluginNameArr.push(key)
  })
  if(pluginNameArr.length == 0){
    return console.log('所有依赖已全部安装。')
  }
  _plugin.install(pluginNameArr, program.registry, finish)

}
/* istanbul ignore next  */
/*
export function commander(_commander){
  _commander.command('import [modules...]')
    .description('引入公共组件')
    .option('-w, --workspace <value>', '指定工作目录')
    .option('-l, --log <value>', 'log日志,( 0[defaul]: show all; 1: show error, fail; 2: show error, fail, warn)',(value)=>{_log.setLevel(value)})
    .option('-r, --registry <value>',  "指定插件的仓库地址")
    .action((modules, program)=>{
      execute(modules, program,  (error)=>{
        if(error){
          _log.error(error);
        }
        _log.success("安装插件完成！".green)
      })
    })
}
*/ 
