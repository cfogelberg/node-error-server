"use strict";

var should = require("should");
var sinon = require("sinon");
var mod = require("../out/server/mod");
var routes = mod("routes/index");
var U = mod("utilities/index");

describe("routes", function() {
  describe("routes.error", function() {
    var req = {};
    var res = {};
    var next;
    var orig_emit;

    beforeEach(function() {
      req = {};
      res = {
        sendfile: sinon.spy()
      };
      next = sinon.spy();
      orig_emit = U.async.emit;
      U.async.emit = sinon.spy();
    });

    afterEach(function() {
      U.async.emit = orig_emit;
    });

    it("responds appropriately to a DB error notification", function() {
      routes.error.database(req, res, next);
      U.async.emit.calledWith("log:save").should.be.true;
      U.async.emit.calledWith("mailgun:send").should.be.true;
      U.async.emit.calledTwice;
      res.sendfile.calledOnce;
      res.statusCode.should.equal(503);
    });

    it("responds appropriately to a server error notification", function() {
      routes.error.node(req, res, next);
      U.async.emit.calledWith("log:save").should.be.true;
      U.async.emit.calledWith("mailgun:send").should.be.true;
      U.async.emit.calledTwice;
      res.sendfile.calledOnce;
      res.statusCode.should.equal(500);
    });

    it("responds appropriately to an other error message notification", function() {
      routes.error.other(req, res, next);
      U.async.emit.calledWith("log:save").should.be.true;
      U.async.emit.calledWith("mailgun:send").should.be.true;
      U.async.emit.calledTwice;
      res.sendfile.calledOnce;
      res.statusCode.should.equal(500);
    });

    it("responds appropriately to an unknown error notification", function() {
      routes.error.unknown(req, res, next);
      U.async.emit.calledWith("log:save").should.be.true;
      U.async.emit.calledWith("mailgun:send").should.be.true;
      U.async.emit.calledTwice;
      res.sendfile.calledOnce;
      res.statusCode.should.equal(500);
    });
  });

  describe("routes.monit", function() {
    var req = {};
    var res = {};
    var next;

    beforeEach(function() {
      req = {};
      res = {
        end: sinon.spy()
      };
      next = sinon.spy();
    });

    it("is_live sets status code and sends response 'alive'", function() {
      routes.monit.is_live(req, res, next);
      res.end.calledWith("alive");
      res.statusCode.should.equal(200);
    });
  });
});
