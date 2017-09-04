import * as _project from "../project"
import _configFiledConstant from '../config-filed-constant';
import _log from '../lib/log'
export default function(pluginName:string){
     let pkg = _project.getProjectPackageJSON()
     delete pkg[_configFiledConstant.get().pluginConfigField][pluginName]
     delete pkg.dependencies[pluginName]
     delete pkg.devDependencies[pluginName]
     _project.writeProjectPackageJSON(pkg)
     _log.success(`Remove ${pluginName} --- done`.green)
}