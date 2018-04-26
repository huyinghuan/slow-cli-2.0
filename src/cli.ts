import * as _project from './project';
import * as _fs from 'fs-extra';

import * as _request from 'request'
import _publicConfig from './public'
import _log from './lib/log'

import _configFiledConstant from './config-filed-constant';
const packageJSON = require('../package')

export function getVersion():string{
  return packageJSON.version;
}

export function checkVersion():boolean{
  let configFiledConstant = _configFiledConstant.get()
  if(!_fs.existsSync(configFiledConstant.CLIConfigFile)){
    console.log('默认执行环境，跳过CLI环境检查')
    return true;
  }
  let packageJSON = _project.getProjectPackageJSON();
  let currentCLIVersion = packageJSON.version;
  let macth = packageJSON[configFiledConstant.pluginVersionField] == currentCLIVersion;
  if(macth){
    return true
  }else{
    console.log(`警告: 项目要求${configFiledConstant.infinity}版本是: ${packageJSON[configFiledConstant.pluginVersionField]} ,本机实际版本为: ${currentCLIVersion}`.red)
    return false;
  }
}

export function checkLatestVersion(){
  let latestQueryURLPrivate = _publicConfig.private_npm_registry + "/silky-reborn/latest"
  let latestQueryURLPublic = "https://registry.npm.taobao.org/silky-reborn/latest"
  let nowVersion = getVersion()

  _request(latestQueryURLPrivate, (err, httpResponse, body)=>{
      if(!err && httpResponse.statusCode == 200){
          body = JSON.parse(body)
          if(body.version != nowVersion){
              _log.info(`silky 存在新版本: ${body.version}\n推荐升级[Mac或Linux 前面 加sudo]：mgtv install -g silky-reborn `.blue)
          }
          return
      }
      _request(latestQueryURLPublic, (err, httpResponse, body)=>{
          if(!err && httpResponse.statusCode == 200){
              body = JSON.parse(body)
              if(body.version != nowVersion){
                  _log.info(`silky 存在新版本:${body.version}, 推荐升级：npm install -g silky-reborn [mac 前面 加sudo]`.blue)
              }
              return
          }
      })

  })
}