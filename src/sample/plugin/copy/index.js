'use strict';
const _fs = require('fs')

exports.registerPlugin = function(cli, options){

  cli.registerHook('build:doNothing', function(data, cb){
    if(!/(.html)$/.test(data.inputFilePath)){
      cli.utils.log("copy plugin dont want to do anything")
      return cb(null, data)
    }
    cli.utils.ensureFileSync(data.outputFilePath)
    cli.utils.log(`copy ${data.inputFilePath} --> ${data.outputFilePath}`)
    var rd = _fs.createReadStream(data.inputFilePath);
    
    rd.on("error", function(err) {
      cb(err);
    });
    var wr = _fs.createWriteStream(data.outputFilePath);
    rd.pipe(wr);
    wr.on("close", function(ex) {
      if(ex){
        return cb(ex)
      }
      cli.utils.log(`hook copy ${data.inputFilePath} -> ${data.outputFilePath} `)
      data.hasProcess = true
      cb(null, data)
    });
  })
  
}