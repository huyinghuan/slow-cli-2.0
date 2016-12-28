import * as _assert from 'assert'
import * as _should from 'should';
import { exec as _exec } from 'child_process';

describe("test build", ()=>{

  it("GET ONE PAGE", function(done){
    this.timeout(20000);
    _exec(`st3 build`, {cwd: "/Users/hyh/workspace/imgotv-channel"}, (error, stdout, stderr)=>{
      _assert.equal(stderr, "")
      done()
    })
  })
});