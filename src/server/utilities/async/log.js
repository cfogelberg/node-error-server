require("../../mod");
var U = mod("utilities/index");
var M = mod("models/index");

module.exports = {
	save: function(error_type, req) {
		var log = new M.Log.model({
			error_type: error_type,
			referer: req.headers["referer"], // not set if URL typed directly or coming from an HTTPS location
			datetime: new Date().getTime(),
			user_agent: req.headers["user-agent"],
			user_ip: req.connection.remoteAddress
		});
		log.save(function(error) {
			if(error) {
				U.sync.logger.server.error(error);
			}
		});
	}
};
