"use strict";

var should = require("should");
var sinon = require("sinon");
var mod = require("../out/server/mod");
var U = mod("utilities/index");

describe("utilities", function() {
  describe("async", function() {
    it("is listening to mailgun:send", function() {
      U.async.listeners("mailgun:send").should.not.be.null;
    });

    it("is listening to log:save", function() {
      U.async.listeners("log:save").should.not.be.null;
    });
  });
});
