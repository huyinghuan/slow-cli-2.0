"use strict";
const _os = require('os');
const _path = require('path');
const _infinity = '.silky';
const _root = _os.homedir();
const config = {
    cliRootDir: _path.join(_root, _infinity),
    pluginDir: _path.join(_root, _infinity, 'node_modules'),
    plguinPackageJSON: _path.join(_root, _infinity, 'package.json'),
    pluginInfo: {
        "name": "mgtv-silky-plugin",
        "version": "0.2.0"
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = config;
