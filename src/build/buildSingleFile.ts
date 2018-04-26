import _configFiledConstant from '../config-filed-constant';
import _getGitHash from '../lib/getGitHash';
import _excuteFileCompile from './excuteFileCompile'
import * as _async from 'async';

import * as _hook from '../hooks/index';
import * as _plugin from '../plugin/index';
import _log from '../lib/log';

export default async function(filepath){
     //加载插件
    _plugin.scanPlugins('build');
    
    let stop = await _hook.triggerBuild("initial")
    if(stop){
      return
    }
    let gitHash =  _getGitHash();  
    let buildConfig = _configFiledConstant.getBuildConfig({
      gitHash:gitHash,
      __extra: [],//额外需要编译的文件
      __del: [] //编译完成后需要删除掉冗余文件
    })
    await _excuteFileCompile(buildConfig, filepath)
}