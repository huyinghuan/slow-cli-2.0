### build:end

全部编译，copy完成

```js
exports.registerPlugin = (cli, options)=>{
  cli.registerHook('build:end', (buildConfig, data, cb)=>{
    let outdir = buildConfig.outdir;
    let packageJSON = require(_path.join(process.cwd(), 'package.json'));
    let tarFile = _path.join(process.cwd(), `${packageJSON.name}@${packageJSON.version}.tar`);
    let commanderStr = `cd "${outdir}" && tar -cf "${tarFile}" .`;
    cli.utils.executeCommand(commanderStr, (error)=>{
      if(error){
        return cb(error);
      }
      console.log("文件打包完成")
      cb(null, data)
    })
  }, 1)
}
```