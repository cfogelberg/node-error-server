module.exports = {
		is_live: function(req, res, next) {
			res.statusCode = 200;
			res.end("alive");
		}
};
