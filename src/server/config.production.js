// Copied by build.xml for target staging to mode-obj.js
var path = require("path");

module.exports = {
	mode_name: "production",
	http_port: 17394,
	database_host: "localhost",
	database_port: "27017",
	database: "node-error-server",
	server_root: __dirname,
	client_root: path.join(__dirname, "../client"),
	express_logger_format: ":remote-addr - - [:date] \":method :url HTTP/:http-version\" :status \":referrer\" \":user-agent\"",
	email: {
		from: "\"Node Error Server\" <node-error-server@yourdomain.com>",
		to: "",
		bcc: "",
		gap: 60 * 1000, // Don't send another email within this time frame
		post_url: "https://api.mailgun.net/v2/api.lettingvetting.com/messages",
		post_auth_user: "username",
		post_auth_pass: "password"
	}
};