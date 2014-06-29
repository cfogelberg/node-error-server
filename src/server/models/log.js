"use strict";

var mongoose = require("mongoose");
exports.model = mongoose.model(
  "Log",
  new mongoose.Schema({
    error_type: String,
    referer: String,
    datetime: Date,
    user_agent: String,
    user_ip: String,
    user_resolution: String
  }),
  "logs"
);
