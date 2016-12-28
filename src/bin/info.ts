
import _configFiledConstant from '../config-filed-constant';
import * as _path from 'path';
import * as _fs from 'fs-extra';
import * as _TerminalRenderer from 'marked-terminal';
import * as _marked from 'marked';
import * as _init from '../init'

export function execute(pluginName, program){
   _init.prepareUserEnv(program.workspace);

  let pluginDir = _path.join(_configFiledConstant.get().pluginDir, pluginName)
  if(!_fs.existsSync(pluginDir)){
    console.log(`${pluginName} 未安装！`)
    return
  }
  let pluginReadmeDocFilePath = _path.join(pluginDir, 'README.md');
  if(!_fs.existsSync(pluginReadmeDocFilePath)){
    let pluginJSON = _fs.readJSONSync(_path.join(pluginDir, 'package.json'));
    let author = pluginJSON.author || pluginJSON._npmUser.name;
    if(!author){author = '匿名'}
    console.log(`该插件没有用户手册，请去叼作者一顿，或者向领导举报！ 作者是: ${author}`)
    return
  }

  let readmeContent = _fs.readFileSync(pluginReadmeDocFilePath, 'utf8');

  _marked.setOptions({
    renderer: new _TerminalRenderer()
  });

  console.log(_marked(readmeContent))
}

export function commander(_commander){
  _commander.command('info <pluginName>')
    .description('获取插件帮助信息')
    .option('-w, --workspace <value>', '指定工作目录')
    .action(execute)
}