var express = require("express"),
models = require('./../models'),
mongoose = require("mongoose"),
router = express.Router(),
bodyParser = require('body-parser'),
querystring = require('querystring'),
ObjectId = mongoose.Types.ObjectId

router.use(bodyParser.urlencoded())

router.post("/found-children",(req,res)=>{
	var data = req.body

	models.children.findOne({idChildren : data.idChildren}, (err,children) => {
		if (err) res.send(err)
		if(children){ res.json(children)} else{res.json({"msg":"Children not found"})}
	})
})

router.post("/valid-activity-complete",(req,res)=>{
	dataGenAct = querystring.parse(req.body.actGeneral),
	dataStep = querystring.parse(req.body.step),
	dataActivity = querystring.parse(req.body.activity)

	console.log(dataGenAct)

	models.adminuser.findOne({userUser : dataGenAct.userUser}, (err,user) => {
		if (err) return res.send(err)
		if(!user) return res.json({"msg":"User not found"})
			dataGenAct.idUser = user.id
			models.children.findOne({idChildren : dataGenAct.idChildren}, (err,children) => {
				if (err) return res.send(err)
				if(!children) return res.json({"msg":"Children not found"})
					dataGenAct.idChildren = children._id
					models.activityhistory.create(dataGenAct, function (err, activity) {
						if (err) return res.send(err);
						return res.json({message:"Activity Add Complete", activity : activity})
					})
			})
	})

})

router.get("/menu-teacher",(req,res)=>{
	res.render("menuTeacher",{user :req.user})
})

router.get("/continue-one",(req,res)=>{
	res.render("continueOne")
})

router.get("/continue-group",(req,res)=>{
	res.render("continueGroup")
})

router.get("/continue/continue-detail-one",(req,res)=>{
	res.render("continueDetailOne")
})

router.get("/steps",(req,res)=>{
	res.render("steps")
})

router.get("/steps/:step",(req,res)=>{
	const numberStep = parseInt(req.params.step)
	console.dir(numberStep)
	var step = {}

	models.step.findOne({step:numberStep}, (err, stepDB) => {
		step = stepDB
		models.activity.find({step:numberStep}, (err, activities) => {
			step.activities = activities
			res.render("stepDetail",{step:step})
		})
	})


})

router.get("/steps/:step/:activity",(req,res)=>{
	const numberStep = parseInt(req.params.step),
		numberActivity = parseInt(req.params.activity)
	var activity = {}

	models.activity.findOne({step : numberStep, activity : numberActivity}, (err, activityDB) => {
		console.log(err)
		activity = activityDB

		models.step.findOne({step : activityDB.step}, (err, stepDB) => {
			activity.step = stepDB
			res.render("activity",{activity:activity, user:req.user})
		})
	})
})

//Exportar una variable de js mediante NodeJS
module.exports = router