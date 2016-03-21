var express = require("express"),
models = require('./../models'),
mongoose = require("mongoose"),
router = express.Router(),
bodyParser = require('body-parser'),
querystring = require('querystring'),
ObjectId = mongoose.Types.ObjectId

router.use(bodyParser.urlencoded())

router.post("/found-step",(req,res)=>{
	var data = req.body

	models.stepvalid.find({_id : data.idChildren})
	.populate('idStep')
	.exec((err, steps) => {
		if(err) return res.json({err:err})
		console.log(steps)
		if(steps) return res.json({steps : steps})
	})
})

router.post("/consul-step",(req,res)=>{
	var data = req.body

	models.step.findOne({stepStep : data.step}, (err, stepFind) => {
		models.activityhistory.find({idChildren : data.idChildren, idStep : stepFind._id})
		.sort({date:-1})
		.populate('idActivity idUser')
		.exec((err, activities) => {
			if(err) return res.json({err:err})
			if(activities) return res.json({activities : activities})
		})
		
	})

})
router.post("/found-children",(req,res)=>{
	var data = req.body

	models.children.findOne({idChildren : data.idChildren}, (err,children) => {
		if(err) res.json({err:err})
		if(children){ res.json(children)} else{res.json({"msg":"Children not found"})}
		//console.log(children)
	})
})

router.post("/valid-activity-parcial",(req,res)=>{
	data = querystring.parse(req.body.actGeneral)
	numberActivity = req.body.activityActivity
	numberStep = req.body.stepActivity
	user = req.user

	data.idUser = user._id
	data.nameUser = user.nameUser
	data.lastnameUser = user.lastnameUser
	//console.log(numberActivity + " *************** " + numberStep)

	models.children.findOne({idChildren : data.idChildren}, (err,children) => {
		if(err) return res.json({err:err})
		data.idChildren = children._id

		models.step.findOne({stepStep : numberStep}, (err,step) => {
			if(err) return res.json({err:err})
			data.idStep = step._id

			models.activity
			.findOne({activityActivity : numberActivity , stepActivity : numberStep},
			(err,activityF) => {
				if(err) return res.json({err:err})
				if(!activityF) return res.json({"msg":"Activity not found"})
					else {
					data.idActivity = activityF._id
					//console.log(data)

					models.activityhistory.create(data, function (err, activity) {
						if(err) return res.json({err:err});
						return res.json({message:"Parcial - Activity Add Complete", activity : activity})
					})
				}
			})
		})
	})
})

router.post("/valid-activity-complete",(req,res)=>{
	data = querystring.parse(req.body.actGeneral)
	numberActivity = req.body.activityActivity
	numberStep = req.body.stepActivity
	user = req.user

	data.idUser = user._id
	data.nameUser = user.nameUser
	data.lastnameUser = user.lastnameUser
	//console.log(numberActivity + " *************** " + numberStep)

	models.children.findOne({idChildren : data.idChildren}, (err,children) => {
		if(err) return res.json({err:err})
		data.idChildren = children._id

		models.step.findOne({stepStep : numberStep}, (err,step) => {
			if(err) return res.json({err:err})
			data.idStep = step._id

			models.activity
			.findOne({activityActivity : numberActivity , stepActivity : numberStep},
			(err,activityF) => {
				if(err) return res.json({err:err})
				if(!activityF) return res.json({"msg":"Activity not found"})
					else {
					data.idActivity = activityF._id
					//console.log(data)
					models.activityvalid.create(data, function (err, activity) {
						if(err) return res.json({err:err});
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
		if(err) return res.json({err:err})
		if(!children) return res.json({"msg":"Children not found"})
		dataChildren = children

		models.parent.find({idChildren : {$in : [children._id]}})
		.sort({relationshipParent:1})
		.exec((err, parents) => {
			if(err) return res.json({err:err})
			if(!parents) return res.json({"msg":"Parents not found"})
			dataChildren.parents = parents

			models.activityhistory.find({idChildren: children._id})
			.sort({date:-1})
			.limit(10)
			.populate('idActivity idStep idUser')
			.exec((err, activities) => {
				if(err) return res.json({err:err})
				if(!activities) return res.json({msg:"Activities not found"})
				dataChildren.activities = activities

				models.activityvalid.find({idChildren:children._id, idStep : activities[0].idStep})
				.populate('idActivity')
				.exec((err, actsvalid) => {
				dataChildren.actsvalid = actsvalid
				//console.log(activities)
				//console.log("aqui " + dataChildren.actsvalid)
				//console.log(dataChildren)
				res.render("continueOne",{childrenAct:dataChildren})
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