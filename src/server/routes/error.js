require("../mod");
var path = require("path");
var moment = require("moment");
var U = mod("utilities/index");
var C = mod("config");

module.exports = {
	database: function(req, res, next) {
		var error_type = "database";
		U.async.emit("log:save", error_type, req);
		U.async.emit("mailgun:send", build_email_object({
			error_type: error_type,
		}));
		res.statusCode = 503;
		res.sendfile(path.join(C.client_root, "dberror.html"));
	},
	
	node: function(req, res, next) {
		var error_type = "server";
		U.async.emit("log:save", error_type, req);
		U.async.emit("mailgun:send", build_email_object({
			error_type: error_type,
		}));
		res.statusCode = 500;
		res.sendfile(path.join(C.client_root, "servererror.html"));
	},
	
	other: function(req, res, next) {
		var error_type = "other";
		U.async.emit("log:save", error_type, req);
		U.async.emit("mailgun:send", build_email_object({
			error_type: error_type,
		}));
		res.statusCode = 500;
		res.sendfile(path.join(C.client_root, "error.html"));
	},
	
	unknown: function(req, res, next) {
		var error_type = "unknown";
		U.async.emit("log:save", error_type, req);
		U.async.emit("mailgun:send", build_email_object({
			error_type: error_type,
		}));
		res.statusCode = 500;
		res.sendfile(path.join(C.client_root, "unknown.html"));
	}
};



function build_email_object(options) { 
	return {
		enqueued: new Date(),
		error_type: options.error_type,
		to: C.email.to,
		from: C.email.from,
		bcc: C.email.bcc,
		subject: "Error server URL accessed: " + options.error_type,
		text: "Error server URL (" + options.error_type + ") accessed at " + 
			moment(new Date()).format("HH:MM:ss DD/MM/YYYY")
	};
};
