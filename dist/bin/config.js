"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _project = require("../project");
const _fs = require("fs-extra");
const _path = require("path");
const _request = require("request");
const _crossSpawn = require("cross-spawn");
const getMD5_1 = require("../lib/getMD5");
const config_filed_constant_1 = require("../config-filed-constant");
const _init = require("../init");
const public_1 = require("../public");
const _glob = require("glob");
const _ignore = require("ignore");
const log_1 = require("../lib/log");
//copy all
const copyAll = (workspace, tmpDirPath, next) => {
    _glob('**', {
        cwd: workspace,
        mark: true
    }, (err, files) => {
        if (err) {
            return next(err);
        }
        let gitignoreFilePath = _path.join(workspace, ".gitignore");
        let filtered = [];
        if (_fs.existsSync(gitignoreFilePath)) {
            filtered = _ignore().add(_fs.readFileSync(gitignoreFilePath).toString()).filter(files);
        }
        else {
            filtered = _ignore().add("node_modules").filter(files);
        }
        if (filtered.length == 0) {
            return next(null);
        }
        _fs.ensureDirSync(tmpDirPath);
        _async.mapSeries(filtered, (file, mapNext) => {
            let sourceFilePath = _path.join(workspace, file);
            let targetFilePath = _path.join(tmpDirPath, file);
            _fs.stat(sourceFilePath, (err, stat) => {
                if (err) {
                    return mapNext(err, null);
                }
                if (stat.isDirectory()) {
                    _fs.ensureDirSync(targetFilePath);
                }
                else if (stat.isFile()) {
                    log_1.default.info(`copy ${file}`);
                    _fs.copySync(sourceFilePath, targetFilePath);
                }
                else {
                    log_1.default.warn(`找不到 ${sourceFilePath} 文件类型`);
                }
                mapNext(null, null);
            });
        }, (err, reuslt) => {
            next(err);
        });
    });
};
//上传配置
function upload(options, finish) {
    _init.prepareUserEnv(options.workspace);
    let project = _project.getProjectPackageJSON();
    let projectName = options.projectName || project.name;
    let version = options.projectVersion || project.version || "";
    let configFiledConstant = config_filed_constant_1.default.get();
    let defConfigServerIP = configFiledConstant.configServer;
    if (!projectName) {
        console.log('缺少配置文件名称，无法上传，请使用 -n 指定');
    }
    if (!version) {
        console.log('缺少配置文件版本，无法上传，请使用 -v 指定');
    }
    let tmpDirName = projectName + "-" + version;
    let workspace = config_filed_constant_1.default.getWorkspace();
    let tmpDirPath = _path.join(workspace, tmpDirName);
    let tmpTarFilePath = tmpDirPath + ".tar";
    let queue = [];
    queue.push((next) => {
        //上传所有
        if (options.all) {
            return copyAll(workspace, tmpDirPath, (err) => {
                if (err) {
                    return next(err);
                }
                if (_fs.existsSync(configFiledConstant.environmentRootDir)) {
                    _fs.copySync(configFiledConstant.environmentRootDir, _path.join(tmpDirPath, '.silky'));
                }
                if (_fs.existsSync(_path.join(workspace, ".gitignore"))) {
                    _fs.copySync(_path.join(workspace, ".gitignore"), _path.join(tmpDirPath, '.gitignore'));
                }
                next(null);
            });
        }
        //仅上传配置
        try {
            _fs.ensureDirSync(tmpDirPath);
            _fs.copySync(configFiledConstant.CLIConfigFile, _path.join(tmpDirPath, 'package.json'));
            if (_fs.existsSync(configFiledConstant.environmentRootDir)) {
                _fs.copySync(configFiledConstant.environmentRootDir, _path.join(tmpDirPath, '.silky'));
            }
            next(null);
        }
        catch (e) {
            next(e);
        }
    });
    queue.push((next) => {
        let results = _crossSpawn.sync("tar", ["-cf", `../${tmpDirName}.tar`, "."], { stdio: 'inherit', cwd: tmpDirPath });
        if (results.status != 0) {
            log_1.default.error(results);
            next(`压缩项目失败`);
        }
        else {
            next(null);
        }
    });
    queue.push((next) => {
        getMD5_1.default(tmpTarFilePath, next);
    });
    queue.push((md5, next) => {
        let serverIp = options.url || public_1.default.silky_config_store;
        if (!serverIp) {
            return next(new Error('未指定配置服务器IP'));
        }
        _request({
            uri: `/api/p/${projectName}/v/${version}/h/${md5}`,
            baseUrl: serverIp,
            method: 'PUT',
            formData: {
                config: _fs.createReadStream(tmpTarFilePath)
            }
        }, (error, resp, body) => {
            if (error) {
                return next(error);
            }
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
        finish(error, `${projectName}-${version}`);
    });
}
exports.upload = upload;
//下载配置
function sync(options, finish) {
    _init.prepareUserEnv(options.workspace);
    let project = _project.getProjectPackageJSON();
    let projectName = options.projectName || project.name;
    let version = options.projectVersion || project.version;
    let configFiledConstant = config_filed_constant_1.default.get();
    if (!projectName) {
        return console.log("Error: 未制定项目名称".red);
    }
    let workspace = config_filed_constant_1.default.getWorkspace();
    let serverIp = options.url || public_1.default.silky_config_store;
    let queue = [];
    let file = "";
    let fileHash = "";
    console.log('开始同步...');
    queue.push((next) => {
        _fs.removeSync(configFiledConstant.CLIConfigFile);
        next(null);
    });
    queue.push((next) => {
        let uri = version ? `/api/p/${projectName}/v/${version}` : `/api/p/${projectName}`;
        let req = _request({
            uri: uri,
            baseUrl: serverIp,
            method: 'GET',
        });
        req.on('response', (resp) => {
            if (resp.statusCode == 404) {
                return next(`服务器没有存储相关项目:${projectName}`);
            }
            if (resp.statusCode !== 200) {
                return next(new Error('http code ' + resp.statusCode));
            }
            fileHash = resp.headers['content-disposition'];
            file = _path.join(workspace, fileHash + ".tar");
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
        let result = _crossSpawn.sync("tar", ["-xf", `${fileHash}.tar`], { cwd: workspace, stdio: 'inherit' });
        if (result.status != 0) {
            next(`解压失败，请手动解压文件 ${file} 到项目根目录`);
        }
        else {
            _fs.removeSync(_path.join(workspace, fileHash + ".tar"));
            next(null);
        }
    });
    _async.waterfall(queue, finish);
}
exports.sync = sync;
/* istanbul ignore next  */
function commander(_commander) {
    _commander.command('sync')
        .alias("download")
        .description('同步配置文件')
        .option('-w, --workspace <value>', '指定工作目录')
        .option('-u, --url <value>', '指定配置存储服务器地址')
        .option('-n, --projectName <value>', "指定同步的项目名称，可选，默认为 package.json => name")
        .option('-v, --projectVersion <value>', "指定同步的项目版本号， 可选，默认为 package.json => version")
        .action((program) => {
        sync(program, (error) => {
            if (error) {
                console.log(error);
            }
            else {
                console.log('同步配置文件成功！请运行 sr install 安装插件。');
            }
        });
    });
    _commander.command('up')
        .alias("upload")
        .description('上传配置文件')
        .option('-w, --workspace <value>', '指定工作目录')
        .option('-u, --url <value>', '指定配置存储服务器地址')
        .option('-a, --all', "包括项目文件全部上传")
        .option('-n, --projectName <value>', "指定同步的项目名称，可选，默认为 package.json => name")
        .option('-v, --projectVersion <value>', "指定同步的项目版本号， 可选，默认为 package.json => version")
        .option('-l, --log <value>', 'log日志,( 0[defaul]: show all; 1: show error, fail; 2: show error, fail, warn)', (value) => { log_1.default.setLevel(value); })
        .action((program) => {
        upload(program, (error, result) => {
            if (error) {
                console.log("上传失败, 错误信息：".red);
                console.log(error);
                return;
            }
            console.log(`上传 ${result} 成功！`);
        });
    });
}
exports.commander = commander;
