#!/usr/bin/env node
':' //; exec node --harmony "$0" "$@";
import * as _commander from 'commander';
import * as _init from '../lib/init';
import _app from '../lib/app';

/**
 * 全局变量，保存配置数据
 */
(global as any).__CLI = {};

const versionDesc = require('../package').version;

_commander.command('start')
  .description('启动http服务')
  .option('-p, --port <n>', '指定运行端口')
  .action((program)=>{
    //读取用户自定义配置
    _init.prepareUserEnv();
    //加载插件
    _init.loadPlugins((error)=>{
      if(error){return}
      //静态域名接口
      if(program.port){
        (global as any).__CLI.port = program.port
      }
      _app()
    });
   
  })

  _commander.version(versionDesc).parse(process.argv)