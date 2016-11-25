"use strict";
const config_filed_constant_1 = require('../config-filed-constant');
const _path = require('path');
const _fs = require('fs-extra');
const _TerminalRenderer = require('marked-terminal');
const _marked = require('marked');
function default_1(_commander) {
    _commander.command('info <pluginName>')
        .description('获取插件帮助信息')
        .action((pluginName) => {
        let pluginDir = _path.join(config_filed_constant_1.default.pluginDir, pluginName);
        if (!_fs.existsSync(pluginDir)) {
            console.log(`${pluginName} 未安装！`);
            return;
        }
        let pluginReadmeDocFilePath = _path.join(pluginDir, 'README.md');
        if (!_fs.existsSync(pluginReadmeDocFilePath)) {
            let pluginJSON = _fs.readJSONSync(_path.join(pluginDir, 'package.json'));
            let author = pluginJSON.author || pluginJSON._npmUser.name;
            if (!author) {
                author = '匿名';
            }
            console.log(`该插件没有用户手册，请去叼作者一顿，或者向领导举报！ 作者是: ${author}`);
            return;
        }
        let readmeContent = _fs.readFileSync(pluginReadmeDocFilePath, 'utf8');
        _marked.setOptions({
            renderer: new _TerminalRenderer()
        });
        console.log(_marked(readmeContent));
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
