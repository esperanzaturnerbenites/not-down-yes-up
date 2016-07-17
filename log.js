const winston = require("winston"),
	CTE = require("./CTE")

var baseNameLog = CTE.BASE_PATH_LOG + CTE.BASE_NAME_LOG,
	date = new Date(),
	filename = baseNameLog
		.replace("year",date.getFullYear())
		.replace("month",date.getMonth())

winston.add(winston.transports.File, {filename: filename})
winston.remove(winston.transports.Console)

module.exports = winston