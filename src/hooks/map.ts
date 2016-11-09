export const route = {
  notFound: 'route:notFound',
  initial: 'route:initial', //静态服务启动之前
  didRequest: 'route:didRequest', //接收到请求后
  willPrepareDirectory: 'route:willPrepareDirectory',
  didPrepareDirectory: 'route:didPrepareDirectory',
  willResponse: 'route:willResponse' //编译内容的加工处理
}
export const build = {
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
}
export const plugin = {
  run: 'plugin:run'
}

export var HookQueue = [];