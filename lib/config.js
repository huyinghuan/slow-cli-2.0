"use strict";
const _os = require('os');
const _path = require('path');
const _infinity = 'silky';
const _infinityDir = `.${_infinity}`;
const _root = _os.homedir();
const config = {
    infinity: _infinity,
    cliRootDir: _path.join(_root, _infinityDir),
    pluginDir: _path.join(_root, _infinityDir, 'node_modules'),
    plguinPackageJSON: _path.join(_root, _infinityDir, 'package.json'),
    pluginInfo: {
        "name": `${_infinity}-plugin`,
        "version": "0.2.0"
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = config;
