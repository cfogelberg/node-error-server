var mongoose = require("mongoose");
exports.model = mongoose.model(
	"Log", 
	new mongoose.Schema({
		error_type: String,
		datetime: Date,
		user: {
			agent: String,
			resolution: String,
			sourceip: String
		}
	}), 
	"logs"
);
