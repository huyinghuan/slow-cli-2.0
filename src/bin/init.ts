import * as _path from 'path';
import * as _ from 'lodash';
import * as _fs from 'fs-extra';
import * as _async from 'async';
import * as _initUtils from '../init/index';
import _configFiledConstant from '../config-filed-constant';
import * as _project from '../project';
import * as _plugin from '../plugin/index';
import * as _init from '../init/index'

import * as _binConfig from './config'

export function execute(program, finish){
  //读取用户自定义配置
  _init.prepareUserEnv(program.workspace);
  //bu s
  let packageJSON = _project.getProjectPackageJSON()
  let configFiledConstant = _configFiledConstant.get()

  let queue = []
  //如果制定了线上项目名
  if(program.projectName){
    queue.push((next)=>{
      _binConfig.sync(program, (err)=>{
        if(err){
          console.log("package.json源文件已删除，内容为：")
          console.log(packageJSON)
          return next(err)
        }
        next(null, _project.getProjectPackageJSON())
      })
    })
  }else{
    queue.push((next)=>{
       next(null, _initUtils.generatorDefaultConfig())
    })
  }

  queue.push((generatorConfig, next)=>{
    // (default-config.plugin-config) [extend] (remote project plugin config)
    // (default-config) [extend] (package json)
    if(program.projectName){
      delete packageJSON[configFiledConstant.pluginConfigField]
    }
    Object.keys(packageJSON).forEach((key)=>{
      if(generatorConfig[key]){
        generatorConfig[key] = _.extend(generatorConfig[key], packageJSON[key])
      }else{
        generatorConfig[key] = packageJSON[key]
      }
    })
    next(null, generatorConfig)
  })
  //生产配置文件
  _async.waterfall(queue, (error, config)=>{
    if(!error){
      _fs.writeJSONSync(configFiledConstant.CLIConfigFile, config)
    }
    finish(error)
  })
}
/* istanbul ignore next  */
export function commander(_commander){
  _commander.command('init')
    .description('初始化')
    .option('-p, --projectName <value>', '根据插件列表名称获取插件列表')
    .option('-w, --workspace <value>', '指定工作目录')
    .action((program)=>{
      execute(program, (error)=>{
        if(error){
          console.log('初始化失败。。。'.red)
          console.log(error);
          process.exit(1);
        }
        console.log('初始化成功！ 安装插件请运行命令 silky install'.green);
        process.exit(0);
      })
    })
}