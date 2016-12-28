"use strict";
const _assert = require("assert");
const child_process_1 = require("child_process");
describe("test build", () => {
    it("GET ONE PAGE", function (done) {
        this.timeout(20000);
        child_process_1.exec(`st3 build`, { cwd: "/Users/hyh/workspace/imgotv-channel" }, (error, stdout, stderr) => {
            _assert.equal(stderr, "");
            done();
        });
    });
});
