import * as _request from 'request'
import _getCLIVersion from './getCLIVersion'
import * as _os from 'os'
export default function(){
    let nowVersion = _getCLIVersion()
    let url = "https://silky.mytools.bid/api/log";
    _request({url:url,method: "POST",json:{
        silky_version: nowVersion,
        os_platform: _os.platform(),
        os_arch: _os.arch(),
        os_release: _os.release(),
        node_version: process.version,
        username: process.env.USER || process.env.USERNAME
    }},(err, httpResponse, body)=>{})
}