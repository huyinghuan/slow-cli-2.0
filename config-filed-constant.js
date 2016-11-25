"use strict";
const _path = require('path');
/**
 * 仅用于记录文件位置
 */
//工具名称
const _infinity = 'silky';
//根目录
const _root = process.cwd();
const config = {
    infinity: _infinity,
    pluginConfigField: `${_infinity}-plugin`,
    pluginVersionField: `${_infinity}-version`,
    pluginDir: _path.join(_root, 'node_modules'),
    CLIConfigFile: _path.join(_root, 'package.json'),
    buildField: `${_infinity}-build`,
    environmentRootDir: _path.join(_root, `.${_infinity}`),
    prerequisiteEnvironment: ['production', 'develop']
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = config;
