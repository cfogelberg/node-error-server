var log4js = require("log4js");
module.exports = {
	server: log4js.getLogger("server"),
	express: log4js.getLogger("express"),
	configure: function() {
		log4js.configure('utilities/sync/log4js.json');
	}
};
