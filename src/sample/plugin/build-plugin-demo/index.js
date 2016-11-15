'use strict';
exports.registerPlugin = function(cli, options){
  cli.registerHook('build:error', (error, cb)=>{
   console.log("执行了 build error hooks")
   cb(error)
  }, 1)
  cli.registerHook('build:initial', (stop, cb)=>{
    console.log('this is first initial hook 1.')
    cb(null, stop)
  }, 1)
  cli.registerHook('build:initial', (stop, cb)=>{
    console.log('this is second initial hook 2.')
    cb(null, stop)
  }, 2)

  cli.registerHook('build:willBuild', (buildConfig, cb)=>{
    buildConfig.test = "xxx";
    console.log("build will do 1: ", buildConfig)
    cb(null, buildConfig)
  }, 2)
  
  cli.registerHook('build:willBuild', (buildConfig, cb)=>{
    buildConfig.test = "xxx";
    console.log("build will do 2: ", buildConfig)
    cb(null, buildConfig)
  }, 1)
}