## global.__CLI

For Developer

```js
{
  index: 'index.html', //start server 默认首页
  port: '14422'
  pluginConfig:{

  }
  buildConfig:{
    outdir: './build',
    ignore: ['node_modules', "^(\\.)"]
  }
  utils: utils //见下文说明。
}
```


## util

```js
/**
 * 文件后缀匹配
 */
export function match(path, express){
  return _minimatch(path, express, {matchBase: true})  
}

/**
 *lodash.extend
 */
export function extend(){
  return _.extend.apply(null, arguments)
}

export function outputFile(){
  return _fs.outputFile.apply(null, arguments)
}

export function outputFileSync(){
  return _fs.outputFileSync.apply(null, arguments)
}

export function ensureFileSync(){
  return _fs.ensureFileSync.apply(null, arguments)
}

export {_log as log}

```

## log

```js

let log:any = function(...args:any[]){
  console.log.apply(null, args)
}

log.warn = (...args:any[])=>{
  console.log.apply(null, args)
}

log.error = (...args:any[])=>{
  console.log.apply(null, args)
} 

log.info = (...args:any[])=>{
  console.log.apply(null, args)
}

log.success = (...args:any[])=>{
  console.log.apply(null, args)
}

log.fail =  (...args:any[])=>{
  console.log.apply(null, args)
}

```