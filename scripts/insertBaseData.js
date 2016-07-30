var baseData = require("./resources/baseData.json"),
	mongoose = require("mongoose"),
	models = require("./../models")

mongoose.connect("mongodb://localhost/centerestimulation")

models.step.create(baseData.steps,function(err,steps){
	if(err) process.exit(1)
	console.log("Steps Create")
	models.activity.create(baseData.activities,function(err,activities){
		if(err) process.exit(1)
		console.log("Activities Create")
		process.exit()
	})
})
