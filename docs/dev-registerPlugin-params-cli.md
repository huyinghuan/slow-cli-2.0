## registerPlugin 中 cli 参数说明

```js
{
  registerHook: function
  options: global.__CLI 详情见文档(global.__CLI)[global-variable-__CLI.md]
  utils: Object 见下文说明
  logs: Object 见下文说明
  cwd: string 当前工作目录
  getRuntimeEnvFileContent:  获取运行时 相对应的文件内容
  getRuntimeEnvConfig:  获取运行时 相对应的
}
```

### util

[utils.ts](../src/hooks/utils.md)

### log

[log.ts](../src/lib/log.ts)

## getRuntimeEnvFileContent

[getRuntimeEnvFileContent](../src/hooks/getRuntimeEnvFileContent)