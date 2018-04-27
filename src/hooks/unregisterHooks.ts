/**
 * 注销所有hooks
 */
import * as _hookMap from './map';
import _configFiledConstant from '../config-filed-constant';
import * as _path from 'path';
import * as _fs from 'fs-extra';

export default function(){
    Object.keys(_hookMap.HookQueue).forEach((key)=>{
        delete _hookMap.HookQueue[key]
    })
    Object.keys(_hookMap.HookExtQueue).forEach((key)=>{
        delete _hookMap.HookQueue[key]
    })
    //清空require缓存
    let pluginConfig = _configFiledConstant.getPluginConfig()
    let pluginNameList = []
    Object.keys(pluginConfig).forEach((key)=>{
        if(key.indexOf('srp') == 0){
            pluginNameList.push(key)
        }
    })
    pluginNameList.push(".silky")
    Object.keys(require.cache).forEach((cacheKey)=>{
        pluginNameList.forEach((pluginName)=>{
            if(cacheKey.indexOf(pluginName) != -1){
                delete require.cache[cacheKey]
            }
        })
    })

}