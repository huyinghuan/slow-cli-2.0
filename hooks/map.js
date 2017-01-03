"use strict";
exports.route = {
    notFound: 'route:notFound',
    initial: 'route:initial',
    didRequest: 'route:didRequest',
    //  willPrepareDirectory: 'route:willPrepareDirectory',
    //  didPrepareDirectory: 'route:didPrepareDirectory',
    willResponse: 'route:willResponse',
    didResponse: 'route:didResponse',
    isDir: 'route:dir'
};
exports.build = {
    initial: 'build:initial',
    // willCompress: 'build:willCompress',
    // didCompress: 'build:didCompress',
    willBuild: 'build:willBuild',
    didBuild: 'build:didBuild',
    doCompile: 'build:doCompile',
    didCompile: 'build:didCompile',
    doNothing: 'build:doNothing',
    //  willProcess: 'build:willProcess',
    //  didProcess: 'build:didProcess',
    //  willMake: 'build:willMake',
    //  didMake: 'build:didMake',
    endBuild: "build:end",
    error: 'build:error',
    serverFilter: 'build:filter'
};
exports.plugin = {
    run: 'plugin:run'
};
exports.HookQueue = [];
exports.HookExtQueue = [];
