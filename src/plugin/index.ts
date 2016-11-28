import _getFullPluginName from './getFullPluginName';
import _scanPlugins from './scanPlugins';
import _loadPlugin from './loadPlugin';
import _checkPluginVersion from './checkPluginVersion';
import _install from './install'
import _setPluginConfig from './setPluginConfig'
import _writePluginConfigToConfigFile from './writePluginConfigToConfigFile'

//获取插件设置 用于传递给hook plugin
export function getPluginConfig(){
  return (global as any).__CLI.pluginsConfig
}

export {
  _getFullPluginName as getFullPluginName,
  _scanPlugins as scanPlugins,
  _loadPlugin as loadPlugin,
  _checkPluginVersion as checkPluginVersion,
  _install as install,
  _setPluginConfig as setPluginConfig,
  _writePluginConfigToConfigFile as writePluginConfigToConfigFile
}