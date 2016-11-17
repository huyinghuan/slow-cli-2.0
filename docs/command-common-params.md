## command 通用参数说明

### -A, --additional

插件开发者灵活使用该参数。用户根据插件文档说明使用该参数

```shell
-A key=value[,key2=value2]
#增加的编译参数为
{
  key: value,
  key2: value2
}
```

额外的环境变量导入.

也可以使用

```shell
-A value

#得到的编译参数为 {extra: value}
```

### -l, --log

log日志,( 0[默认]: show all; 1: show error, fail; 2: show error, fail, warn)

```
-l 0 显示所有类型的log

-l 1 显示 error和fail

-l 2 显示 error ，fail， warn

```