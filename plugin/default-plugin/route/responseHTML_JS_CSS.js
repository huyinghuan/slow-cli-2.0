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
const _fs = require("fs");
const _path = require("path");
const regList = [
    /(\.js)$/,
    /(\.css)$/,
    /(\.html)$/
];
function match(realPath) {
    for (let i = 0, length = regList.length; i < length; i++) {
        if (regList[i].test(realPath)) {
            return true;
        }
    }
    return false;
}
exports.registerPlugin = function (cli, options) {
    cli.registerHook('route:didRequest', (req, data, content) => __awaiter(this, void 0, void 0, function* () {
        let realPath = data.realPath;
        let filePath = _path.join(cli.cwd(), realPath);
        if (!match(filePath)) {
            return content;
        }
        if (!_fs.existsSync(filePath)) {
            return content;
        }
        data.status = 200;
        return _fs.readFileSync(filePath, 'utf8');
    }), 0);
};
