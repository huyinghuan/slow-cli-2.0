'use strict';
const _fs = require('fs')

exports.registerPlugin = (cli, options)=>{
  cli.registerHook('build:doNothing', function(data, cb){
    cli.utils.ensureFileSync(data.outputFilePath)
    cli.log.info(`copy ${data.inputFilePath} --> ${data.outputFilePath}`)
    var rd = _fs.createReadStream(data.inputFilePath);
    rd.on("error", function(err) {cb(err);});
    var wr = _fs.createWriteStream(data.outputFilePath);
    rd.pipe(wr);
    wr.on("close", function(ex) {
      if(ex){return cb(ex)}
      cli.log.info(`copy ${data.inputFilePath} -> ${data.outputFilePath} `)
      data.hasProcess = true
      cb(null, data)
    });
  }, 99)
}