"use strict";
const _project = require('../project');
const _fs = require('fs-extra');
const _path = require('path');
const _async = require('async');
const _request = require('request');
const getMD5_1 = require('../lib/getMD5');
const executeCommand_1 = require('../lib/executeCommand');
const config_filed_constant_1 = require('../config-filed-constant');
const _defConfigServer = config_filed_constant_1.default.configServer;
//上传配置
const updateload = function (project, options) {
    if (!project.name) {
        console.log('缺少package.json文件，无法上传');
    }
    let tmpDirName = project.name + "-" + project.version + "-" + Date.now();
    let tmpDirPath = _path.join(process.cwd(), tmpDirName);
    let tmpTarFilePath = tmpDirPath + ".tar";
    let commanderStr = `cd "${tmpDirPath}" && tar -cf "${tmpTarFilePath}" .`;
    let queue = [];
    queue.push((next) => {
        try {
            _fs.ensureDirSync(tmpDirPath);
            _fs.copySync(_path.join(process.cwd(), 'package.json'), _path.join(tmpDirPath, 'package.json'));
            if (_fs.existsSync(_path.join(process.cwd(), '.silky'))) {
                _fs.copySync(_path.join(process.cwd(), '.silky'), _path.join(tmpDirPath, '.silky'));
            }
            next(null);
        }
        catch (e) {
            next(e);
        }
    });
    queue.push((next) => {
        executeCommand_1.default(commanderStr, next);
    });
    queue.push((next) => {
        getMD5_1.default(tmpTarFilePath, next);
    });
    queue.push((md5, next) => {
        let serverIp = options.url || project["config-server"] || _defConfigServer;
        if (!serverIp) {
            return next(new Error('未指定配置服务器IP'));
        }
        _request({
            uri: `/api/p/${project.name}/v/${project.version}/h/${md5}`,
            baseUrl: serverIp,
            method: 'PUT',
            formData: {
                config: _fs.createReadStream(tmpTarFilePath)
            }
        }, (error, resp, body) => {
            console.log(md5);
            if (error) {
                return next(error);
            }
            console.log(body);
            if (resp.statusCode != 200) {
                next(`http code: ${resp.statusCode}`);
            }
            else {
                next();
            }
        });
    });
    _async.waterfall(queue, (error) => {
        _fs.removeSync(tmpDirPath);
        _fs.removeSync(tmpTarFilePath);
        if (error) {
            console.log("上传失败, 错误信息：".red);
            console.log(error);
            return;
        }
        console.log('上传成功！');
    });
};
//下载配置
const sync = function (project, options) {
    let projectName = options.name || project.name;
    let version = options.version || project.version;
    if (!projectName) {
        return console.log("Error: 未制定项目名称".red);
    }
    let serverIp = options.url || project["config-server"] || _defConfigServer;
    let queue = [];
    let file = "";
    let fileHash = "";
    queue.push((next) => {
        let req = _request({
            uri: `/api/p/${project.name}/v/${project.version}`,
            baseUrl: serverIp,
            method: 'GET',
        });
        req.on('response', (resp) => {
            if (resp.statusCode !== 200) {
                return next(new Error('http code ' + resp.statusCode));
            }
            fileHash = resp.headers['content-disposition'];
            file = _path.join(process.cwd(), fileHash + ".tar");
            let fws = _fs.createWriteStream(file);
            resp.pipe(fws);
            resp.on('end', () => {
                next(null);
            });
        });
        req.on('error', (error) => { next(error); });
    });
    //获取文件hash值
    queue.push((next) => {
        getMD5_1.default(file, (next));
    });
    //对比服务器端hash值
    queue.push((md5, next) => {
        console.log(md5, fileHash);
        if (md5 !== fileHash) {
            return next(new Error('文件下载错误，请重新下载！'));
        }
        next(null);
    });
    //解压文件并删除文件
    queue.push((next) => {
        let commandStr = `tar -xf ${file}`;
        executeCommand_1.default(commandStr, (error) => {
            if (error) {
                console.log(`解压失败，请手动解压文件 ${file} 到项目根目录`);
                return next(error);
            }
            _fs.removeSync(file);
            next(null);
        });
    });
    _async.waterfall(queue, (error) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log('同步配置文件成功！');
        }
    });
};
function default_1(_commander) {
    _commander.command('config <actionName>')
        .description('上传或者同步配置文件 up or sync ')
        .option('-u, --url <value>', '指定配置存储服务器地址')
        .option('-n, --name <value>', "指定同步的项目名称，可选，默认为 package.json => name")
        .option('-v, --version <value>', "指定同步的项目版本号， 可选，默认为 package.json => name")
        .action((actionName, program) => {
        let packageJSON = _project.getProjectPackageJSON();
        switch (actionName) {
            case "up":
                updateload(packageJSON, program);
                break;
            case "sync":
                sync(packageJSON, program);
                break;
        }
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
