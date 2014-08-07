"use strict";

var path = require("path");

module.exports = {
  mode_name: "dev",
  http_port: 17394,
  database_host: "localhost",
  database_port: "27017",
  database: "simple-error-server",
  server_root: __dirname,
  client_root: path.join(__dirname, "../client"),
  express_logger_format: ":remote-addr - - [:date] \":method :url HTTP/:http-version\" :status \":referrer\" \":user-agent\"",
  email: {
    send_emails: false,
    from: "\"Simple Error Server\" <simple-error-server@yourdomain.com>",
    to: "engineering@yourdomain.com",
    bcc: "needs-to-know@yourdomain.com",
    gap: undefined,
    post_url: "https://api.mailgun.net/v2/yourdomain.com/messages",
    post_auth_user: "username",
    post_auth_pass: "password"
  }
};
