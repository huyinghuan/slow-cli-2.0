"use strict";
const _minimatch = require('minimatch');
const _should = require('should');
describe("minimatch test", () => {
    it("/ax/axx/xx.html *.html true", () => {
        _should(_minimatch("/ax/axx/xx.html", "*.+(html|hbs)", { matchBase: true })).be.true();
    });
});
