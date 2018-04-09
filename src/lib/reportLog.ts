import * as _request from 'request'
import * as _cli from '../cli'
import * as _os from 'os'
import * as _path from 'path'
import * as _project from '../project'
export default function(type:string = 'start', status:string){
    let nowVersion = _cli.getVersion()
    let url = "https://silky.mytools.bid/api/log";
    _request({url:url,method: "POST",json:{
        silky_version: nowVersion,
        os_platform: _os.platform(),
        os_arch: _os.arch(),
        os_release: _os.release(),
        node_version: process.version,
        username: process.env.USER || process.env.USERNAME,
        project_name: _project.getProjectPackageJSONField('name'),
        type: type,
        status: status
    }},(err, httpResponse, body)=>{})
}