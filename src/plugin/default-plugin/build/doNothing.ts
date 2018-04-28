'use strict';
import * as _fs from 'fs';
import * as _ from 'lodash';

exports.registerPlugin = (cli, options)=>{
  cli.registerHook('build:doNothing', function(buildConfig, data){
    if(!_.isString(data.outputFilePath)){
      throw new Error("禁止copy两个相同文件")
    }
    cli.utils.ensureFileSync(data.outputFilePath)
    return new Promise((resolve, reject)=>{
      var rd = _fs.createReadStream(data.inputFilePath);
      rd.on("error", function(err) {
        reject(err)
      });
      var wr = _fs.createWriteStream(data.outputFilePath);
      rd.pipe(wr);
      wr.on("close", function(ex) {
        if(ex){return reject(ex)}
        cli.log.info(`copy ${data.inputFileRelativePath} -> ${data.outputFileRelativePath} `)
        data.hasProcess = true
        resolve()
      });
    })
    
  }, 1000)
}