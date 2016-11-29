## 编译less文件

配置项：

```js
...
"silky-plugin":{
  "sp-less": {
    "_env_global": ["global.less"], //or "global.less"
    "global": ["css/globalA.less"], // or "global.less"
    "ignore": [
      "(css/module/)"
    ]
  }
  ...
}
...  
```


""

### _env_global

文件名或文件名数组（string, Array<string>）

读取指定的环境等文件 添加到每一个文件中。 如: `"_env_global": ["global.less"]`使用 `silky start -e production`, `silky build -e production` 读取文件等顺序是:
(不存在读下一个，存在则返回存在的文件内容加入到每个文件末尾)

```
 .silky/production／global.less -> .silky/normal／global.less -> .silky/global.less
```

提示尽量使用`production or develop`文件和`normal`文件夹. 不要使用第三种方式。

### global

读取的是项目目录下的less文件， 将这些文件加入到每个编译文件或者访问的文件末尾。

如`"global": ["css/globalA.less"]`使用`silky start -e production`, `silky build -e production`, `silky build -e develop` 读取的文件都是`xxx/projectXXX/css/globalA.less`,
【小提醒: `"global": ["css/globalA.less"]` 等同于将 `globalA.less`放在`normaol`文件夹下，同时使`"_env_global": ["globalA.less", "xxx", ...]`】


### ignore
符合正则表达式的string字符串。 一般作为模块组件的less文件，使用这个字段标记，避免编译组件到`build`文件夹内。 上述`global`引用的文件将自动加入到`ignore`中来。
