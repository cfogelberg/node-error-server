var mongoose = require("mongoose");
exports.model = mongoose.model(
	"Email", 
	new mongoose.Schema({
		enqueued: Date,
		to: String,
		from: String,
		bcc: String,
		subject: String,
		text: String
	}), 
	"emails"
);
