"use strict";
const _assert = require("assert");
const _super = require('supertest');
const _color = require('colors');
const log_1 = require("../lib/log");
const _start = require("../bin/start");
describe("test start server", () => {
    log_1.default.setLevel(1);
    let _agent = _super.agent(_start.getHttpServer({
        workspace: "/Users/hyh/workspace/imgotv-channel"
    }));
    it('Get a index.html', function (done) {
        this.timeout(300000);
        _agent.get('/')
            .expect(404)
            .end(function (err, resp) {
            _assert.equal(err, null);
            done();
        });
    });
    it('Get a exists Page', function (done) {
        this.timeout(300000);
        _agent.get('/page/channel/vip-index.html')
            .expect(200)
            .end(function (err, resp) {
            _assert.equal(err, null);
            done();
        });
    });
    it('Get a exists imag', function (done) {
        this.timeout(300000);
        _agent.get('/image/loadingimg/img1420-460.jpg')
            .expect(200)
            .end(function (err, resp) {
            _assert.equal(err, null);
            done();
        });
    });
    it('Get a exists js', function (done) {
        this.timeout(300000);
        _agent.get('/js/lib/home.index.v5.bundle.js')
            .expect(200)
            .end(function (err, resp) {
            _assert.equal(err, null);
            done();
        });
    });
    it('Get a exists css', function (done) {
        this.timeout(300000);
        _agent.get('/css/page/index/page-index.css')
            .expect(200)
            .end(function (err, resp) {
            _assert.equal(err, null);
            done();
        });
    });
    it('Get a dont exists file', function (done) {
        this.timeout(300000);
        _agent.get('/css/page/index/xxxx')
            .expect(404)
            .end(function (err, resp) {
            _assert.equal(err, null);
            done();
        });
    });
});
