require("../../mod");
var request = require("request");
var U = mod("utilities/index");
var C = mod("config");
var M = mod("models/index");

module.exports = {
	// messageObject: { to, from, subject, text }
	send: function(messageObject) {
		messageObject.bcc = C.email.bcc;
		
		var email_log = new M.Email.model(messageObject);
		email_log.save(function(error) {
			if(!error) {
				var requestParameters = {
					form: messageObject,
					auth: {
						user: C.email.post_auth_user,
						pass: C.email.post_auth_pass,
						sendImmediately: false
					}
				};
				
				request.post(C.email.post_url, requestParameters);
				U.sync.logger.server.info("U.async.email.send - email \"" + messageObject.subject + 
					"\" sent to " + messageObject.to);
			}
			else {
				U.sync.logger.server.error(error);
			}
		});
	}
};
