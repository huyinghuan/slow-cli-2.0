"use strict";
const _build = require("../bin/build");
const buildProcess_1 = require("../build/buildProcess");
const _assert = require("assert");
const log_1 = require("../lib/log");
const _color = require('colors');
describe("Test Build Process", () => {
    log_1.default.setLevel(1);
    it("Build Process", function (done) {
        this.timeout(30000);
        buildProcess_1.default(function () {
            _build.prepare({
                workspace: "/Users/hyh/workspace/imgotv-channel",
                outdir: "/data/xx-process"
            });
        }, (error) => {
            _assert.equal(error, null);
            done();
        }, false);
    });
});
