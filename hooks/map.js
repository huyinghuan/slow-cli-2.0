"use strict";
exports.route = {
    notFound: 'route:notFound',
    initial: 'route:initial',
    didRequest: 'route:didRequest',
    willPrepareDirectory: 'route:willPrepareDirectory',
    didPrepareDirectory: 'route:didPrepareDirectory',
    willResponse: 'route:willResponse' //编译内容的加工处理
};
exports.build = {
    initial: 'build:initial',
    willCompress: 'build:willCompress',
    didCompress: 'build:didCompress',
    willBuild: 'build:willBuild',
    didBuild: 'build:didBuild',
    willCompile: 'build:willCompile',
    didCompile: 'build:didCompile',
    willProcess: 'build:willProcess',
    didProcess: 'build:didProcess',
    willMake: 'build:willMake',
    didMake: 'build:didMake',
    error: 'build:error'
};
exports.plugin = {
    run: 'plugin:run'
};
exports.HookQueue = [];
