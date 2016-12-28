"use strict";
const config_filed_constant_1 = require("../config-filed-constant");
const _ = require("lodash");
function default_1(config, pluginConfig) {
    config[config_filed_constant_1.default.pluginConfigField] = _.extend(config[config_filed_constant_1.default.pluginConfigField], pluginConfig);
    return config;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
