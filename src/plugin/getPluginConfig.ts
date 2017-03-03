import * as _fs from 'fs-extra';
import * as _plugin from './index';
import * as _project from '../project';

import _configFiledConstant from '../config-filed-constant';
//写入插件配置到配置文件，用于安装插件时，配置默认项
export default function getPluginConfig(pluginName){
  let packageJSON = _project.getProjectPackageJSON()
  let pluginConfig = packageJSON[_configFiledConstant.get().pluginConfigField]
  return  pluginConfig[pluginName] ? pluginConfig[pluginName] : {}
}
