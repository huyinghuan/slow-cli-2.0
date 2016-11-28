import * as _init from '../init'
import * as _projectUtils from '../lib/project';
import * as _plugin from '../plugin/index';
import * as _ from 'lodash';
import _preparePrerequisiteDir from '../init/preparePrerequisiteDir'

export default function(_commander){
  _commander.command('check')
    .description('检查版本信息和插件信息')
    .option('-f, --fix', '修复相关配置文件')
    .action((program)=>{
      //读取用户自定义配置
      _init.prepareUserEnv();
      //检查cli 版本
      _projectUtils.checkCLIVersion();
      // 检查插件版本
      let isMatchPluginVersion = _plugin.checkPluginVersion();
      
      if(program.fix){
        console.log('更新配置文件...')
        // TODO
        let defaultConfig = _init.generatorDefaultConfig()
        let packageJSON = _init.getProjectPackageJSON()
        _.extend(defaultConfig, packageJSON)
        _init.writeProjectPackageJSON(defaultConfig)

        _preparePrerequisiteDir()
        console.log('更新配置文件完成...')
      }
    })
}