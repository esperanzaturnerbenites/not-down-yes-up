var express = require("express"),
	models = require("./../models"),
	router = express.Router(),
	bodyParser = require("body-parser"),
	jade = require("jade"),
	functions = require("./functions"),
	CTE = require("./../CTE"),
	localsJade = {
		parserCustom: functions.parserCustom,
		CTE: CTE
	}

router.use(bodyParser.urlencoded({extended:false}))
router.use(bodyParser.json())

router.get("/menu-teacher",(req,res)=>{res.render("menuTeacher")})

router.post("/startActivity",(req,res)=>{
	var data = req.body

	models.children.findOne({idChildren:data.idChildren},function(err,children){
		models.activity.findOne({activityActivity:data.idActivity,stepActivity:data.idStep},function(err,activity){
			if(!activity) return res.json({message:"No Existe la actividad", statusCode:CTE.STATUS_CODE.INFORMATION})
			
			localsJade.activity = activity
			localsJade.children = children

			var fn = jade.compileFile("views/contentActivity.jade",{})
			var html = fn(localsJade)
			return res.json({html: html,message:"Correcto",statusCode:CTE.STATUS_CODE.OK})
		})

	})
})

router.post("/valid-activity",(req,res)=>{
	var data = req.body

	models.activityhistory.count(
		{idChildren:data.idChildren,idActivity:data.idActivity,idStep:data.idStep},
		function(err,count){
			if(err) return res.json(err)

			if(count < CTE.MIN_NUMBER_ACTIVITIES_HISTORIES_FOR_VALIDATE_ACTIVITY){
				return res.json({
					message:"Debe Completar por lo minimo " + CTE.MIN_NUMBER_ACTIVITIES_HISTORIES_FOR_VALIDATE_ACTIVITY + " activides parciales",
					statusCode:CTE.STATUS_CODE.INFORMATION
				})
			}else{
				models.activityvalid.findOne(
					{idChildren:data.idChildren,idActivity:data.idActivity,idStep:data.idStep},
					function(err,activityvalid){
						if(activityvalid){
							activityvalid.update({$set:data},function(err,updateActivityvalid){
								return res.json({message:"Validación Actividad Actualizada",type:CTE.STATUS_CODE.OK})
							})
						}else{
							models.activityvalid.create(data,function(err,newActivityvalid){
								models.children.update(
									{_id:data.idChildren},
									{$set:{statusChildrenEstimulation:CTE.STATUS_ESTIMULATION.IN_PROGRESS}},
									function(err,update){
										if(err) return res.json({message:"Validación Actividad Completada, No se Actualizo el estado del niñ@",type:CTE.STATUS_CODE.OK})
										return res.json({message:"Validación Actividad Completada",type:CTE.STATUS_CODE.OK})
									}
								)
							})
						}
					})
			}
		})
})

router.get("/steps",(req,res)=>{
	models.step.find({}).sort({stepStep:1}).exec(function (err, steps){res.render("stepMenu",{steps:steps})})
})

router.get("/steps/:step",(req,res)=>{
	const numberStep = parseInt(req.params.step)

	models.step.findOne({stepStep:numberStep}).lean()
	.exec((err, step) => {
		models.activity.find({stepActivity:numberStep}).sort({activityActivity:1})
		.exec((err, activities) => {
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
		models.step.findOne({stepStep : activityDB.stepActivity}, (err, stepDB) => {
			res.render("activity",{activity:activity,step:stepDB})
		})
	})
})

router.post("/info-children/view-more",(req,res)=>{
	var view = "views/reportsEstimulation/",
		query,
		fieldsPopulate,
		fieldsSort = {},
		collection,
		func = false,
		data = req.body,
		dataJade = {}

	if(data.typeReport == 1){
		view = view + "infoChildren.jade"
		collection = "children"
		query = {_id:data.idChildren}
		fieldsPopulate = "idParent"
	}else if(data.typeReport == 2){
		collection = "activityhistory"
		query = {idChildren:data.idChildren}
		view = view + "historyActivities.jade"
		fieldsPopulate = "idChildren idStep idActivity idUser"
		fieldsSort = {date:-1,idStep:-1}
		func = functions["groupHistoryActivitiesByStep"]
	}else if(data.typeReport == 3){
		collection = "activityvalid"
		query = {idChildren:data.idChildren}
		view = view + "activityValids.jade"
		fieldsPopulate = "idChildren idStep idActivity idUser"
		fieldsSort = {date:-1}
	}else{
		return res.json({html:"<p>El Reporte No Existe</p>"})
	}

	models[collection].find(query)
	.populate(fieldsPopulate)
	.sort(fieldsSort)
	.exec(function(err,documents){
		localsJade.dataCustom = documents
		if(func) localsJade.dataCustomFilter = func(documents)
		if(err) res.json(err)
		var fn = jade.compileFile(view,{})
		var html = fn(localsJade)
		return res.json({html:html})
	})
})

router.get("/info-children/:id",(req,res)=>{
	const idChildren = parseInt(req.params.id)
	var dataChildren = {}

	models.children.findOne({idChildren: idChildren})
	.populate('idParent.idParent')
	.exec((err, children) => {
		if(err) return res.json({err:err})
		if(!children) return res.json({"message":"Children not found",statusCode:CTE.STATUS_CODE.NOT_OK})
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

module.exports = router
