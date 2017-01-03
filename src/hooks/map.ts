export const route = {
  notFound: 'route:notFound',
  initial: 'route:initial', //静态服务启动之前
  didRequest: 'route:didRequest', //接收到请求后
//  willPrepareDirectory: 'route:willPrepareDirectory',
//  didPrepareDirectory: 'route:didPrepareDirectory',
  willResponse: 'route:willResponse', //编译内容的加工处理
  didResponse: 'route:didResponse',
  isDir: 'route:dir'
}
export const build = {
  initial: 'build:initial', //正式编译之前
 // willCompress: 'build:willCompress',
 // didCompress: 'build:didCompress',
  willBuild: 'build:willBuild',
  didBuild: 'build:didBuild',
  doCompile: 'build:doCompile', //编译内容处理加工
  didCompile: 'build:didCompile', //
  doNothing: 'build:doNothing',
//  willProcess: 'build:willProcess',
//  didProcess: 'build:didProcess',
//  willMake: 'build:willMake',
//  didMake: 'build:didMake',
  endBuild: "build:end", //
  error: 'build:error',
  serverFilter: 'build:filter'
}
export const plugin = {
  run: 'plugin:run'
}

export var HookQueue = [];
export var HookExtQueue = [];