import * as _assert from 'assert'
const _color = require('colors')
import _log from '../lib/log'
import * as _config from '../bin/config';

describe("Test config commander", ()=>{
  _log.setLevel(1);
  it('upload config', function(done){
    _config.upload({
      url: "http://10.200.8.234:18866",
      workspace: "/Users/hyh/workspace/imgotv-channel"
    }, (error, result)=>{
      console.log("upload config result:",  result)
      _assert.equal(error, null);
      done()
    })
  });

  it('sync config', function(done){
    _config.sync({url: "http://10.200.8.234:18866",workspace: "/Users/hyh/workspace/imgotv-channel"}, (error)=>{
      _assert.equal(error, null);
      done()
    })
  })

});