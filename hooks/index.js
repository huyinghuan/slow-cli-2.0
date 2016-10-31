"use strict";
const triggerHttpCompilerHook_1 = require('./triggerHttpCompilerHook');
exports.triggerHttpCompilerHook = triggerHttpCompilerHook_1.default;
const triggerRouterHook_1 = require('./triggerRouterHook');
exports.triggerRouterHook = triggerRouterHook_1.default;
const scanPlugins_1 = require('./scanPlugins');
exports.scanPlugins = scanPlugins_1.scanPlugins;
function triggerHook(hookName, req, callback) { }
exports.triggerHook = triggerHook;
