## registerPlugin 中 cli 参数说明

```js
{
  registerHook: function
  options: global.__CLI 详情见文档(global.__CLI)[global-variable-__CLI.md]
  utils: Object 见下文说明
  logs: Object 见下文说明
  cwd: string 当前工作目录
  runtime:  获取运行时 一些工具函数
}
```

### util

[utils.ts](../src/hooks/utils.md)

### log

[log.ts](../src/lib/log.ts)

## runtime

### getRuntimeEnvFile

[getRuntimeEnvFile](../src/runtime-enviroment/getRuntimeEnvFile.ts)

```typescript
/**
 * desc:
 *   搜索顺序  指定的运行环境【默认:develop】 -->  通用目录搜索 -->  .silky根目录
 * 
 * params:
 *    filename, 文件名称
 *    asString 作为string返回
 *    
 * return:
 *    string or jsonObject or function
 * 
 * throw Error
 */
getRuntimeEnvFile(filename:string, asString:boolean):any

//Demo：
getRuntimeEnvFile("global.js")
/*
.silky/production/global.js 或者 .silky/production/global.js 内容：

//当导出对象中存在$data属性，并且为function时， 将会执行该函数【并且传入 一个project 对象，里面包含一些 项目 数据，如git hash等】。
// 将函数的返回值当作 该文件的内容
exports.$data = function(project){
  console.log(project)
  return {
    xxxx:Xxxx
  }
}

等同于
//不过这个里面无法获取 传入的项目数据
module.exports = {
  xxxx:Xxxx
}
*/
```