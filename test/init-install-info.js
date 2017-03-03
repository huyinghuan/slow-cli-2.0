"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _assert = require("assert");
const _color = require('colors');
const _fs = require("fs-extra");
const _path = require("path");
const _init = require("../bin/init");
const _install = require("../bin/install");
const _info = require("../bin/info");
describe('Init and Install', function () {
    let temDir = _path.join(__dirname, 'temp');
    _fs.removeSync(temDir);
    _fs.ensureDirSync(temDir);
    it('init project', function (done) {
        _init.execute({
            workspace: temDir
        }, (error) => {
            _assert.equal(error, null);
            done();
        });
    });
    it('install plugin from some one', function (done) {
        this.timeout(1000000);
        _install.execute(["version"], { workspace: temDir, registry: "https://registry.npmjs.com/" }, (error) => {
            _assert.equal(error, null);
            done();
        });
    });
    it('install plugin from all', function (done) {
        this.timeout(1000000);
        _fs.removeSync(_path.join(temDir, "node_modules"));
        _install.execute([], { workspace: temDir, registry: "https://registry.npmjs.com/" }, (error) => {
            _assert.equal(error, null);
            done();
        });
    });
    it('info get plugin Readme', function () {
        let msg = _info.execute("sp-version", { workspace: temDir });
        _assert.ok(msg.length);
        _fs.removeSync(temDir);
    });
});
