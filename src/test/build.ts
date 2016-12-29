import * as _assert from 'assert'
import * as _should from 'should';
const _super = require('supertest');
const _color = require('colors')
import * as _build from '../bin/build';
import _log from '../lib/log'
import { getBuildServer } from '../bin/build';


describe("test build server", ()=>{
  _log.setLevel(1);

  it('Build Server For build Project', function(done){
    this.timeout(300000)
    let _agent = _super.agent(_build.getBuildServer({
      workspace: "/Users/hyh/workspace/imgotv-channel",
      outdir: "/data/xx"
    }))
    _agent.get('/all?outdir=/data/xx')
      .expect(200)
      .end(function (err, resp) {
        _assert.equal(err, null);
      })
    _agent.get('/single?outdir=/data/xx4&filepath=/template/page/channel/shaoer-index.hbs')
      .expect(200)
      .end(function (err, resp) {
        _assert.equal(err, null);
      })
    setTimeout(()=>{done()}, 20000)
  })
});