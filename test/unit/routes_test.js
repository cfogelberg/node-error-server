"use strict";

describe("routes", function() {
  var should = require("should");
  var sinon = require("sinon");
  var mod = require("../out/server/mod");
  var routes = mod("routes/index.js");
  var U = mod("utilities/index");

  describe("error", function() {
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

    it.skip("responds appropriately to an other error message notification", function() {
      // Check U.async.emit called with log:save
      // Check U.async.emit called with mailgun:send
      // Check res.sendfile was called
      // Check res.statuscode = 500
    });

    it.skip("responds appropriately to an unknown error notification", function() {
      // Check U.async.emit called with log:save
      // Check U.async.emit called with mailgun:send
      // Check res.sendfile was called
      // Check res.statuscode = 500
    });
  });

  describe("monit", function() {
    it.skip("some monit test goes here", function() {

    });
  });
});
