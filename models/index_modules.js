const models = {
	user: require("./models/user"),
	adminuser: require("./models/adminUser"),
	children: require("./models/children"),
	parent: require("./models/parent"),
	activityvalid: require("./models/activityValid"),
	activityhistory: require("./models/activityHistory"),
	stepvalid: require("./models/stepValid"),
	activity: require("./models/activity"),
	step: require("./models/step")
}

module.exports = models