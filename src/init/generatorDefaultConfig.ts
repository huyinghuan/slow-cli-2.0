import * as _projectUtils from '../lib/project';
import _fileConfig from '../file-config';
/**
 * 用户写入到项目目录下的package.json文件中。
 * 必须包含的信息
 * 项目名：   name      default: 文件夹名称
 * 项目版本： version   default: 1.0 项目版本
 * cli-version：     defalut： 依赖于初始化 cli 版本
 * cli-plugin：      default: {} //插件配置，和插件启用状态
 * cli:              default: cli 默认配置
 */
export default function(){
  let result:any = {};
  result.name = _projectUtils.getProjectDirectoryName();
  result.version = '1.0';
  result[_fileConfig.pluginVersionField] = _projectUtils.getCLIVersion();
  result[_fileConfig.pluginConfigField] = {};
  result[_fileConfig.infinity] = {};
  return result;
}