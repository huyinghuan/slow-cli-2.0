//获取插件完成名称
export default function(pluginName, needVersion?){
  let pluginStrArray = pluginName.split('@')
  pluginName = pluginStrArray[0];
  let version = pluginStrArray[1];

  if(!/^(sp\-)/.test(pluginName)){
    pluginName = `sp-${pluginName}`
  }

  return (needVersion && version)  ? `${pluginName}@${version}`: pluginName;
}