"use strict";
const _ = require('lodash');
const generatorDefaultConfig_1 = require('./generatorDefaultConfig');
function default_1() {
    //获取默认配置
    let defaultConfig = generatorDefaultConfig_1.default();
    let startEnv = global.__CLI[];
    //判断当前全局变量是否满足运行需要
    if (_.isPlainObject())
        ;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
