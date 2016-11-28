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
 *    string or jsonObject 
 * 
 * throw Error
 */
getRuntimeEnvFile(filename:string, asContent:boolean):any

```