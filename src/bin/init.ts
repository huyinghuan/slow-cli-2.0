import * as _path from 'path';
import * as _ from 'lodash';

//查询项目插件配置
const getProjectConfig = (projectName, cb):void=>{
  //TODO: 从服务器获取项目插件配置配置
  let pluginConfig = {};
  cb(null, pluginConfig)
}

export default function(_commander){
  _commander.command('init')
    .description('初始化')
    .option('-p, --pluginList <value>', '根据插件列表名称获取插件列表')
    .action((program)=>{
      

      

    })
}