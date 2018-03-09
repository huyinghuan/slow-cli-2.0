"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_filed_constant_1 = require("../config-filed-constant");
const _ = require("lodash");
function default_1(ignore) {
    let ignoreList = config_filed_constant_1.default.getBuildConfig('ignore');
    ignoreList = _.union(ignoreList, [].concat(ignore));
    config_filed_constant_1.default.setBuildParams({ ignore: ignoreList });
}
exports.default = default_1;
