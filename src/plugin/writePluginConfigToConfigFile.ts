import * as _fs from 'fs-extra';
import * as _plugin from './index';
import * as _project from '../project';
//写入插件配置到配置文件，用于安装插件时，配置默认项
export default function writePluginConfigToConfigFile(pluginConfig){
  let packageJSON = _project.getProjectPackageJSON()
  packageJSON = _plugin.setPluginConfig(packageJSON, pluginConfig)
  _project.writeProjectPackageJSON(packageJSON)
}
