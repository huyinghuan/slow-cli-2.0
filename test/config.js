"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _assert = require("assert");
const _color = require('colors');
const log_1 = require("../lib/log");
const _config = require("../bin/config");
describe("Test config commander", () => {
    log_1.default.setLevel(1);
    it('upload config', function (done) {
        _config.upload({
            url: "http://10.200.8.234:18866",
            workspace: "/Users/hyh/workspace/imgotv-channel"
        }, (error, result) => {
            console.log("upload config result:", result);
            _assert.equal(error, null);
            done();
        });
    });
    it('sync config', function (done) {
        _config.sync({ url: "http://10.200.8.234:18866", workspace: "/Users/hyh/workspace/imgotv-channel" }, (error) => {
            _assert.equal(error, null);
            done();
        });
    });
});
