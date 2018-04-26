import * as _path from 'path';
import * as _ from 'lodash';
import * as _fs from 'fs-extra';
import * as _initUtils from '../init/index';
import _configFiledConstant from '../config-filed-constant';
import * as _project from '../project';
import * as _plugin from '../plugin/index';
import * as _init from '../init/index'

import * as _binConfig from './config'

export async function execute(program){
  //读取用户自定义配置
  _init.prepareUserEnv(program.workspace);
  //bu s
  let packageJSON = _project.getProjectPackageJSON()
  let configFiledConstant = _configFiledConstant.get()
  let generatorConfig = null
  if(program.projectName){
    await _binConfig.sync(program)
    generatorConfig = _project.getProjectPackageJSON()
  }else{
    generatorConfig = _initUtils.generatorDefaultConfig()
  }
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
  _fs.writeJSONSync(configFiledConstant.CLIConfigFile, generatorConfig)
}
/* istanbul ignore next  */
export function commander(_commander){
  _commander.command('init')
    .description('初始化')
    .option('-p, --projectName <value>', '根据插件列表名称获取插件列表')
    .option('-w, --workspace <value>', '指定工作目录')
    .action(async (program)=>{
      await execute(program)
      console.log('初始化成功！ 安装插件请运行命令 silky install'.green);
    })
}