"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_filed_constant_1 = require("../config-filed-constant");
const _ = require("lodash");
function default_1(config, pluginConfig) {
    let configFiledConstant = config_filed_constant_1.default.get();
    config[configFiledConstant.pluginConfigField] = _.extend(config[configFiledConstant.pluginConfigField], pluginConfig);
    return config;
}
exports.default = default_1;
