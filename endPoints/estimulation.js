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
	data = querystring.parse(req.body.actGeneral)
	numberActivity = req.body.activityActivity
	numberStep = req.body.stepActivity
	console.log(numberActivity + " *************** " + numberStep)

	models.user.findOne({_id : req.user.idUser}, (err,user) => {
		if (err) return res.send(err)
		if(!user) return res.json({"msg":"User not found"})
			data.idUser = user._id
			data.nameUser = user.nameUser
			data.lastnameUser = user.lastnameUser
			console.log("nameUser "+data.nameUser)

			models.children.findOne({idChildren : data.idChildren}, (err,children) => {
				if (err) return res.send(err)
				if(!children) return res.json({"msg":"Children not found"})
					data.idChildren = children._id

					models.activity.findOne({activityActivity : numberActivity , stepActivity : numberStep}, (err,activityF) => {
						if (err) return res.send(err)
						if(!activityF) return res.json({"msg":"Activity not found"})
							else {
							data.idActivity = activityF._id
							//console.log(data)
							models.activityhistory.create(data, function (err, activity) {
								if (err) return res.send(err);
								return res.json({message:"Valid - Activity Add Complete", activity : activity})
							})
						}	
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

router.get("/infoChildren/:id",(req,res)=>{
	const idChildren = parseInt(req.params.id)
	var dataChildren = {}

	models.children.findOne({idChildren: idChildren}, (err, children) => {
		dataChildren = children

		models.mom.findOne({idChildren: children._id}, (err, mom) => {
			dataChildren.mom = mom

			models.dad.findOne({idChildren: children._id}, (err, dad) => {
				dataChildren.dad = dad

				models.care.findOne({idChildren: children._id}, (err, care) => {
					dataChildren.care = care

					models.activityhistory.find({idChildren: dataChildren._id})
					.sort({date:-1})
					.limit(10)
					.populate('idActivity idUser')
					.exec((err, activities) => {
						dataChildren.activities = activities
						//console.log(dataChildren.activities)
						//console.log(dataChildren)
						res.render("continueOne",{childrenAct:dataChildren})
					
					})
				})
			})
		})

	})

})

router.get("/steps",(req,res)=>{
	var step = {}

	models.step.find({}, (err, stepDB) => {
		step = stepDB
		//console.dir(step)
		res.render("stepMenu",{steps:step})
	})
})

router.get("/steps/:step",(req,res)=>{
	const numberStep = parseInt(req.params.step)
	var step = {}

	models.step.findOne({stepStep:numberStep}, (err, stepDB) => {
		step = stepDB
		models.activity.find({stepActivity:numberStep}, (err, activities) => {
			step.activities = activities
			res.render("stepDetail",{step:step})
		})
	})
})

router.get("/steps/:step/:activity",(req,res)=>{
	const numberStep = parseInt(req.params.step),
		numberActivity = parseInt(req.params.activity)
	var activity = {}

	models.activity.findOne({stepActivity : numberStep, activityActivity : numberActivity}, (err, activityDB) => {
		activity = activityDB
		//console.log(activityDB.stepActivity)

		models.step.findOne({step : activityDB.stepActivity}, (err, stepDB) => {
			activity.step = stepDB
			res.render("activity",{activity:activity, user:req.user})
		})
	})
})

//Exportar una variable de js mediante NodeJS
module.exports = router