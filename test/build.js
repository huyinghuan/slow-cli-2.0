"use strict";
const _assert = require("assert");
const _super = require('supertest');
const _build = require("../bin/build");
const log_1 = require("../lib/log");
describe("test build", () => {
    log_1.default.setLevel(1);
    it("Build Process", function (done) {
        this.timeout(30000);
        _build.execute({
            workspace: "/Users/hyh/workspace/imgotv-channel",
            outdir: "/data/xx"
        }, (error) => {
            _assert.equal(error, null);
            done();
        });
    });
});
