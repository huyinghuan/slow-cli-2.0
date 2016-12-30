import generatorDefaultConfig from './generatorDefaultConfig';
import _configFiledConstant from '../config-filed-constant';
import * as _fs from 'fs-extra';
import * as _project from '../project';
/**
 * 准备用户环境，配置等
 * params <pure> boolean, 纯净模式，不加载任何插件
 */
export default function prepareUserEnv(workspace, pure?:boolean){
  workspace = workspace || process.cwd();
  //设置工作根目录
  _configFiledConstant.setWorkspace(workspace);

  let config = {}
  let defaultConfig = generatorDefaultConfig();
  let configFiledConstant = _configFiledConstant.get();
  if(!_fs.existsSync(configFiledConstant.CLIConfigFile) || pure){
    console.log(`非 ${configFiledConstant.infinity} 项目， 启用纯净模式<不加载任何插件>`);
    config = defaultConfig
  }else{
    //读取项目目录下的package.json
    //读取package.json下用户自定义配置
    config = _project.getProjectPackageJSON()
  }
  //如果package.json里面没有相关配置，那么则使用默认配置。
  _configFiledConstant.setGlobal(config[configFiledConstant.infinity] || defaultConfig[configFiledConstant.infinity]);
  _configFiledConstant.setGlobal({pluginsConfig: config[configFiledConstant.pluginConfigField]});
  _configFiledConstant.setGlobal({buildConfig: config[configFiledConstant.buildField] || defaultConfig[configFiledConstant.buildField]});
}
