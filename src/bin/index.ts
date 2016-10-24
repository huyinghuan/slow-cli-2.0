#!/bin/sh
':' //; exec node --harmony "$0" "$@";
import * as _commander from 'commander';
import * as _init from '../lib/init'
import _app from '../lib/app'
var __CLI:any = (global as any).__CLI = {};

const init = function(){

}

_commander.command('start')
  .description('启动http服务')
  .option('-p, --port <n>', '指定运行端口')
  .action((program)=>{
    //读取用户自定义配置
    _init.prepareUserEnv();
    //静态域名接口
    if(program.port){
      __CLI.port = program.port
    }
    _app()

  })