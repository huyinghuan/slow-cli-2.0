import * as _minimatch from 'minimatch';
import * as _assert from 'assert';
import * as _should from 'should';

describe("minimatch test", ()=>{
  it("/ax/axx/xx.html *.html true", ()=>{
    _should(_minimatch("/ax/axx/xx.html", "*.+(html|hbs)", {matchBase: true})).be.true();
  })
})