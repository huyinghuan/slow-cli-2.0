"use strict";
const file_config_1 = require('../file-config');
const _ = require('lodash');
function default_1(config, pluginConfig) {
    config[file_config_1.default.pluginConfigField] = _.extend(config[file_config_1.default.pluginConfigField], pluginConfig);
    return config;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
