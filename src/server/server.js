require("./mod");
var fs = require("fs");
var express = require("express");
var mongoose = require("mongoose");
var http = require("http");
var path = require("path");
var log4js = require("log4js");

var L = mod("logger/index");
var U = mod("utilities/index");
var C = mod("config");
var routes = mod("routes/index");

process.on("uncaughtException", function(error) {
	if(L && L.server && L.server.error) {
		L.server.error("Uncaught exception, exiting. Error details:");
		L.server.error(error.stack);
	}
	else {
		console.error("BACKUP LOG TO CONSOLE IN CASE OF TOTAL SERVER/LOGGER FAILURE:\n" + error.stack);
	}
	process.exit();
});

var environment_mode = process.argv[2];
if(environment_mode === "development" || environment_mode === "staging" || environment_mode === "production") {
	Error.stackTraceLimit = Infinity;
	var http_server = stand_up_http_server_object(environment_mode);
	http_server.listen(C.http_port, function() {
		L.server.info("Express HTTP server listening on port %d", C.http_port);
	});
}
else {
	console.error("Usage error - unknown mode: " + process.argv[2]);
	console.error("Usage: " + process.argv[0] + " " + process.argv[1] + " [development|staging|production]");
}



function stand_up_http_server_object(environment_mode) {
	var app = express().set("env", environment_mode);
	configure_express_object(app);
	return http.createServer(app);
}

function configure_express_object(app) {
	if(app.get("env") !== C.mode_name) {
		throw new Error("Server command line environment ('" + app.get("env") + 
				"') does not match installed mode ('" + C.mode_name + "')");
	}
	L.configure();
	mongoose.connect("mongodb://" + C.database_host + ":" + C.database_port + " /" + C.database);

	configure_express_middleware(app);
	configure_express_routes(app);
};

function configure_express_middleware(app) {
	app.use(express.favicon(path.join(C.client_root, "favicon.ico")));
	app.use(express.compress());
	app.use(log4js.connectLogger(L.express, { level: "auto", format: C.express_logger_format }));
	// TODO express.limit (connect.limit) is being removed in connect 3.0.0 - consider using https://github.com/stream-utils/raw-body
	app.use(express.limit("16kb"));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router); // api error routes (they look like they're static)
	app.use(express.static(C.client_root)); // actual static content
	app.use(routes.error.unknown); // fall back to always sending error.html (but don't save or email anything)
	if(C.mode_name === "development" || C.mode_name === "staging") {
		app.use(express.errorHandler());
	}
	else {
		app.use(function(err, req, res, next) { // http://calv.info/node-and-express-tips/
		    err.status  = err.status    || 500;
		    err.message = err.message   || "Internal server error";
		    err.code    = err.code      || "INTERNAL_ERROR";
	
		    if (req.xhr) { // if AJAX
		        ajax_error_handler(err, req, res, next);
		    } else { // assume static
		        static_error_handler(err, req, res, next);
		    }
		});
	}
};

function configure_express_routes(app) {
	app.get("/dberror.html", routes.error.database);
	app.get("/servererror.html", routes.error.node);
	app.get("/error.html", routes.error.other);
};

function ajax_error_handler(err, req, res, next) {
	res.statusCode = 500;
	res.setHeader("Content-type", "application/json");
	res.end("{\"error\":\"Error server error\"}");
};

function static_error_handler(err, req, res, next) {
	res.statusCode = 500;
	res.setHeader("Content-type", "text/html");
	res.write("<html><body><h1>Error server error</h1></body></html>");
};
