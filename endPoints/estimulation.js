var express = require("express"),
	models = require("./../models"),
	router = express.Router(),
	bodyParser = require("body-parser"),
	jade = require("jade")

router.use(bodyParser.urlencoded({extended:false}))
router.use(bodyParser.json())

router.post("/startActivity",(req,res)=>{
	var data = req.body
	var fn = jade.compileFile("views/contentActivity.jade",{})
	models.children.findOne({idChildren:data.idChildren},function(err,children){
		models.activity.findOne({activityActivity:data.idActivity,stepActivity:data.idStep},function(err,activity){
			var html = fn({activity: activity,children: children})
			return res.json({html: html})
		})

	})
})

/* OK */ 
router.get("/steps",(req,res)=>{
	var step = {}

	models.step.find({})
	.sort({stepStep:1})
	.exec((err, stepDB) => {
		step = stepDB
		res.render("stepMenu",{steps:step})
	})
})

/* OK */
router.get("/steps/:step",(req,res)=>{
	const numberStep = parseInt(req.params.step)
	var step = {}

	models.step.findOne({stepStep:numberStep}, (err, stepDB) => {
		step = stepDB
		models.activity.find({stepActivity:numberStep})
		.sort({activityActivity:1})
		.exec((err, activities) => {
			step.activities = activities
			res.render("stepDetail",{step:step})
		})
	})
})

/* OK */
router.get("/steps/:step/:activity",(req,res)=>{
	const numberStep = parseInt(req.params.step),
		numberActivity = parseInt(req.params.activity)
	var activity = {}

	models.activity.findOne({stepActivity : numberStep, activityActivity : numberActivity}, (err, activityDB) => {
		activity = activityDB
		models.step.findOne({stepStep : activityDB.stepActivity}, (err, stepDB) => {
			res.render("activity",{activity:activity,step:stepDB})
		})
	})
})

/* OK */
router.get("/menu-teacher",(req,res)=>{res.render("menuTeacher"/*,{user :req.user}*/)})

/* OK */
router.get("/info-children/:id",(req,res)=>{
	const idChildren = parseInt(req.params.id)
	var dataChildren = {}

	models.children.findOne({idChildren: idChildren})
	.populate('idParent.idParent')
	.exec((err, children) => {
		if(err) return res.json({err:err})
		if(!children) return res.json({"msg":"Children not found"})
		dataChildren = children
		
		dataChildren.parents = children.idParent.map(objParent => {return objParent.idParent})

		models.activityhistory.find({idChildren: children._id})
		.sort({date:-1})
		.limit(10)
		.populate("idActivity idStep idUser")
		.exec((err, activities) => {
			if(err) return res.json({err:err})
			if(activities.length){
				dataChildren.activities = activities

				models.activityvalid.find({idChildren:children._id, idStep : activities[0].idStep})
				.populate("idActivity idStep idUser")
				.exec((err, actsvalid) => {
					if(err) return res.json({err:err})
					dataChildren.actsvalid = actsvalid
					return res.render("infoChildrenEstimulation",{childrenAct:dataChildren})
				})
			}else {return res.render("infoChildrenEstimulation",{childrenAct:dataChildren})}
		})
	})
})

router.post("/found-step",(req,res)=>{
	var data = req.body

	models.stepvalid.find({idChildren : data.idChildren})
	.populate("idStep idUser")
	.exec((err, steps) => {
		if(err) return res.json({err:err})
		if(steps) return res.json({steps : steps})
	})
})

router.post("/consul-step",(req,res)=>{
	var data = req.body,
		dataFind = {}

	models.step.findOne({stepStep : data.step}, (err, stepFind) => {
		dataFind.steps = stepFind

		models.activityhistory.find({idChildren : data.idChildren, idStep : stepFind._id})
		.sort({date:-1})
		.populate("idActivity idUser")
		.exec((err, activities) => {
			if(err) return res.json({err:err})
			data.activities = activities
			if(activities) return res.json({data : data})
		})

	})
})

//Exportar una variable de js mediante NodeJS
module.exports = router
