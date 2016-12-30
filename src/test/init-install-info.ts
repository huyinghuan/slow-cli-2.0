import * as _assert from 'assert'
const _color = require('colors')
import _log from '../lib/log'
import * as _fs from 'fs-extra';
import * as _path from 'path';
import * as _init from '../bin/init';
import * as _install from '../bin/install';
import * as _info from '../bin/info';

describe('Init and Install', function(){
  let temDir = _path.join(__dirname, 'temp')
  _fs.removeSync(temDir)
  _fs.ensureDirSync(temDir);
  it('init project', function(done){
    _init.execute({
      workspace: temDir
    }, (error)=>{
      _assert.equal(error, null);
      done()
    })
  })
  it('install plugin from some one', function(done){
    this.timeout(1000000)
    _install.execute(["version"], {workspace: temDir, registry: "https://registry.npmjs.com/"}, (error)=>{
      _assert.equal(error, null);
      done()
    })
  })

  it('install plugin from all', function(done){
    this.timeout(1000000)
    _fs.removeSync(_path.join(temDir, "node_modules"))
    _install.execute([], {workspace: temDir, registry: "https://registry.npmjs.com/"}, (error)=>{
      _assert.equal(error, null);
      done()
    })
  })

  it('info get plugin Readme', function(){
    let msg = _info.execute("sp-version", {workspace: temDir})
    _assert.ok(msg.length)
    _fs.removeSync(temDir)
  })

})

