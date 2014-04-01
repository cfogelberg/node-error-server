require("../../mod");

var events = require("events");
var async_event_aggregator = new events.EventEmitter();

var mailgun = mod("utilities/async/mailgun");
async_event_aggregator.on("mailgun:send", mailgun.send);

var log = mod("utilities/async/log");
async_event_aggregator.on("log:save", log.save);

module.exports = async_event_aggregator;
