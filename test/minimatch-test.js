"use strict";
const _minimatch = require('minimatch');
describe("minimatch test", () => {
    it("/ax/axx/xx.html *.html true", () => {
        (_minimatch("/ax/axx/xx.html", "*.html")).should.be.true;
    });
});
