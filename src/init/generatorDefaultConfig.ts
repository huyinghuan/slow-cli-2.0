import * as _projectUtils from '../lib/project';

/**
 * 必须包含的信息
 * 项目名：   name      default: 文件夹名称
 * 项目版本： version   default: 1.0 项目版本
 * silky-version：     defalut： 依赖于初始化silky版本
 * silky-plugin：      default: {} //插件配置，和插件启用状态
 * silky:              default: silky默认配置
 * 
 */
export default function(){
  const projectName = _projectUtils.getProjectDirectoryName();
  const projectVersion = '1.0';
  const silkyVersion = _projectUtils.getCLIVersion();
  const silkyPlugin = {};
  const silky = {};
  return {
    name: projectName,
    version: projectVersion,
    "silky-version": silkyVersion,
    "silky-plugin": silkyPlugin,
    silky: silky
  }
}