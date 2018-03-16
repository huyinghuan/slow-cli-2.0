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
const _path = require("path");
const _ = require("lodash");
const _fs = require("fs");
const config_filed_constant_1 = require("../../../config-filed-constant");
const _mimeTypes = require("mime-types");
exports.registerPlugin = function (cli) {
    cli.registerHook('route:notFound', function (req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            let workspace = config_filed_constant_1.default.getWorkspace();
            let path = req.path;
            if (path == '/') {
                path = `/${cli.options.index}`;
            }
            let responseFilePath = _path.join(workspace, _.compact(path.split('/')).join(_path.sep));
            let mime = _mimeTypes.lookup(responseFilePath) || "application/octet-stream";
            if (_fs.existsSync(responseFilePath)) {
                resp.writeHead(200, { 'Content-Type': mime });
                return new Promise((resolve, reject) => {
                    _fs.readFile(responseFilePath, (err, data) => {
                        if (err) {
                            reject(err);
                        }
                        resp.write(data);
                        resp.end();
                        resolve(true);
                    });
                });
            }
            return false;
        });
    });
};
