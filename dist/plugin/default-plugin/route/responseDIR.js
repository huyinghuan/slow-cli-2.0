"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _fs = require("fs-extra");
const _path = require("path");
const _ = require("lodash");
function format(date) {
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
}
exports.registerPlugin = function (cli, options) {
    cli.registerHook('route:dir', (path, data) => __awaiter(this, void 0, void 0, function* () {
        let realTemplateDir = _path.join(cli.cwd(), path);
        return new Promise((resolve, reject) => {
            _fs.readdir(realTemplateDir, (error, files) => {
                if (error) {
                    return reject(error);
                }
                //根目录不需要显示上一层
                if (path != '/') {
                    data.fileArray.push({
                        href: _path.dirname(path),
                        path: _path.dirname(path),
                        filename: "⤴️..",
                        isDir: true
                    });
                }
                for (let i = 0, length = files.length; i < length; i++) {
                    let file = files[i];
                    let state = _fs.statSync(_path.join(realTemplateDir, file));
                    if (file.indexOf(".") == 0) {
                        continue;
                    }
                    let fileData = {
                        href: _path.join(path, file),
                        path: _path.join(path, file),
                        filename: file
                    };
                    if (state.isDirectory()) {
                        fileData.isDir = true;
                    }
                    else {
                        fileData.isFile = true;
                    }
                    data.fileArray.push(_.extend(fileData, {
                        size: state.size,
                        mtime: format(state.mtime),
                        birthtime: format(state.birthtime)
                    }));
                }
                resolve(null);
            });
        });
    }), -1);
};
