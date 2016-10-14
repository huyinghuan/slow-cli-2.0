"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    plugin: {
        run: 'plugin:run'
    },
    route: {
        notFound: 'route:notFound',
        initial: 'route:initial',
        didRequest: 'route:didRequest',
        willPrepareDirectory: 'route:willPrepareDirectory',
        didPrepareDirectory: 'route:didPrepareDirectory',
        willResponse: 'route:willResponse'
    },
    build: {
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
        didMake: 'build:didMake'
    },
    error: "error",
};
