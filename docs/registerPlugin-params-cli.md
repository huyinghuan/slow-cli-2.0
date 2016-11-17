## registerPlugin 中 cli 参数说明

```js
{
  registerHook: function
  options: global.__CLI 详情见文档(global.__CLI)[global-variable-__CLI.md]
  utils: Object 见下文说明
  logs: Object 见下文说明
}
```

### util

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


```

### log

```js

  class Log{
    private level = 0;
    constructor() {}
    /**
    * default 0: show all
    *  1: show error, fail
    *  2: show error, fail, warn
    */
    setLevel(value){this.level = ~~value}
    warn(...args) {
      if(_.indexOf([0,2], this.level) != -1) console.log.apply(null, args); 
    }
    error(...args) { 
      if(_.indexOf([0,1,2], this.level) != -1) console.log.apply(null, args); 
    }
    fail(...args) { if(_.indexOf([0,1, 2], this.level) != -1) console.log.apply(null, args); }
    info(...args) { if(_.indexOf([0], this.level) != -1) console.log.apply(null, args); }
    success(...args) { if(_.indexOf([0], this.level) != -1) console.log.apply(null, args);}
    
  }
  export default new Log();

```

  