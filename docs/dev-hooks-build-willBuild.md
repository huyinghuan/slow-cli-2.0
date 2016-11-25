### build:willBuild

即将要编译了。可以增加更多的编译参数或者修改编译参数

```js

expors.registerPlugin = (cli, options)=>{
  //buildConfig 编译参数。 具体查看  [docs/command]
  //cb [error, buildConfig]
  cli.registerHook('build:willBuild', (buildConfig, cb)=>{
    buildConfig.test = "xxx";
    console.log("build will do 2: ", buildConfig)
    cb(null, buildConfig)
  }, 1)
}

```