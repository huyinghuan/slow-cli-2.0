import * as _minimatch from 'minimatch';
import * as _assert from 'assert';
import * as _should from 'should';

describe("minimatch test", ()=>{
  it("/ax/axx/xx.html *.html true", ()=>{
    (_minimatch("/ax/axx/xx.html", "*.html")).should.be.true;
  })
})