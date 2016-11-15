'use strict';
const _fs = require('fs')

exports.registerPlugin = function(cli, options){

  cli.registerHook('build:doNothing', function(data, cb){
    if(!/(.html)$/.test(data.inputFilePath)){
      console.log("copy plugin dont want to do anything")
      return cb(null, data)
    }
    /*
    console.log(`hook copy ${data.inputFilePath} --> ${data.outputFilePath} `)
    var rd = _fs.createReadStream(data.inputFilePath);
    
    rd.on("error", function(err) {
      console.log('9888')
      cb(err);
    });
    var wr = _fs.createWriteStream(data.outputFilePath);
    rd.pipe(wr);
    wr.on("close", function(ex) {
      if(ex){
        console.log(88, ex)
        return cb(ex)
      }
      console.log(`hook copy ${data.inputFilePath} --> ${data.outputFilePath} `)
      data.hasProcess = true
      cb(null, data)
    });
    */
    cb(null, data)
  })


  // cli.registerHook('build:doNothing', function(data, cb){
  //   console.log(`build do nothing: ${data.filename}`)
  // })
  
}