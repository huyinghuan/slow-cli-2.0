"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _project = require("../project");
const config_filed_constant_1 = require("../config-filed-constant");
const log_1 = require("../lib/log");
function default_1(pluginName) {
    let pkg = _project.getProjectPackageJSON();
    delete pkg[config_filed_constant_1.default.get().pluginConfigField][pluginName];
    delete pkg.dependencies[pluginName];
    delete pkg.devDependencies[pluginName];
    _project.writeProjectPackageJSON(pkg);
    log_1.default.success(`Remove ${pluginName} --- done`.green);
}
exports.default = default_1;
