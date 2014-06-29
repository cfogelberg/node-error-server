"use strict";

var mongoose = require("mongoose");
exports.model = mongoose.model(
  "Email",
  new mongoose.Schema({
    error_type: String,
    enqueued: Date,
    to: String,
    from: String,
    bcc: String,
    subject: String,
    text: String
  }),
  "emails"
);
