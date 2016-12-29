import * as _build from '../bin/build';
import _buildProcess from '../build/buildProcess';
import * as _assert from 'assert'
import _log from '../lib/log'
const _color = require('colors');

describe("Test Build Process", ()=>{
  _log.setLevel(1);
  it("Build Process", function(done){
    this.timeout(30000)
    _buildProcess(function(){_build.prepare({
      workspace: "/Users/hyh/workspace/imgotv-channel",
      outdir: "/data/xx-process"
    })}, (error)=>{
      _assert.equal(error, null);
      done()
    }, false)
  })
})
