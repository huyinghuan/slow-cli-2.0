import * as _request from 'request'
import _publicConfig from '../public'
import * as _cli from '../cli'
import _log from './log'
export default function(){
    let latestQueryURLPrivate = _publicConfig.private_npm_registry + "/silky-reborn/latest"
    let latestQueryURLPublic = "https://registry.npm.taobao.org/silky-reborn/latest"
    let nowVersion = _cli.getVersion()

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