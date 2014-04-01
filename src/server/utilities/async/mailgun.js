require("../../mod");
var request = require("request");
var U = mod("utilities/index");
var C = mod("config");
var M = mod("models/index");

module.exports = {
	// message: { to, from, subject, text }
	send: function(message) {
		if(C.email.gap) {
			var check_date = new Date(new Date() - C.email.gap);
			var recent_email_query = { enqueued: {$gt: check_date}, error_type: message.error_type };
			M.Email.model.find(recent_email_query, {_id:1}, {}, function(err, res) {
				if(err) {
					U.sync.logger.server.error("U.async.mailgun.send - error with find: " + 
						util.inspect(recent_email_query));
				}
				else if(res.length === 0) {
					save_and_send_email(message);
				}
				else {
					U.sync.logger.server.info("U.async.mailgun.send - repeat email (NOT SENT) \"" + 
						message.subject + "\" sent to " + message.to);
				}
			});
		}
		else {
			save_and_send_email(message);
		}
	}
};



function save_and_send_email(message) {
	var email_record = new M.Email.model(message);
	email_record.save(function(error) {
		if(!error) {
			var requestParameters = {
				form: message,
				auth: {
					user: C.email.post_auth_user,
					pass: C.email.post_auth_pass,
					sendImmediately: false
				}
			};
			
			request.post(C.email.post_url, requestParameters);
			U.sync.logger.server.info("U.asyncsend - email \"" + message.subject + 
				"\" sent to " + message.to);
		}
		else {
			U.sync.logger.server.error(error);
		}
	});
}
