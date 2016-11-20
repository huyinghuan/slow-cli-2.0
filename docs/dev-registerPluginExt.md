## 插件扩展

插件扩展紧作为插件的功能补充存在。不单独作为插件使用。

所有插件扩展的命名必须以 `-ext` 作为结尾。

格式规范:

```js

/*
cli 同 dev-registerPlugin-params-cli,  不过没有registerHook ，增加 registerExt 函数
options 同 dev-registerPlugin-params-options。 仅多出个限制条件【所有插件扩展的命名必须以 `-ext` 作为结尾】
*/
exports.registerPluginExt = function(cli, options){
  /*
    命名规范：
    必须为 [pluginName:extensionName]构成,见demo
  */
  cli.registerExt(extName, extFunction)
}
```

e.g.:

hbs-import-ext:

```js
exports.registerPluginExt = function(cli, options){
  cli.registerExt('hbs:import', function(handlebars){
    ....
  })
}

```

hbs-pub-ext:

```js
exports.registerPluginExt = function(cli, options){
  cli.registerExt('hbs:pub', function(handlebars){
    ....
  })
}
```