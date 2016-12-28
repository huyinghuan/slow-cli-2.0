import * as _assert from 'assert'
import * as _should from 'should';
const _super = require('supertest');

import * as _build from '../bin/build';
import _log from '../lib/log'


describe("test build", ()=>{
  _log.setLevel(1);
  it("Build Process", function(done){
    this.timeout(30000)
    _build.execute({
      workspace: "/Users/hyh/workspace/imgotv-channel",
      outdir: "/data/xx"
    }, (error)=>{
      _assert.equal(error, null);
      done()
    })
  })
});