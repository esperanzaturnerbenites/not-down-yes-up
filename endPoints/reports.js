var express = require("express"),
	models = require("./../models"),
	CTE = require("./../CTE"),
	router = express.Router(),
	bodyParser = require("body-parser"),
	jade = require("jade"),
	functions = require("./functions"),
	Q = require("q"),
	filename = require("filename"),
	mongoose = require("mongoose"),
	localsJade = {
		dataGeneral:{},
		parserCustom: functions.parserCustom,
		CTE: CTE
	}

router.use(bodyParser.urlencoded({extended:false}))

router.post("/consult-teacher-activities",(req,res)=>{
	var data = req.body,
		numberStep = parseInt(data.consulTeacherStep)

	models.step.findOne({stepStep:numberStep},function(err,stepFind){
		models.activityhistory.aggregate([
			{$match: {idUser:mongoose.Types.ObjectId(data.consulTeacher),idStep:stepFind._id}},
			{$sort: { date : 1}},
			{$group: {
				_id: {idChildren: "$idChildren",idActivity: "$idActivity"},
				scoreTotalTeachActivity: {$sum:"$scoreTeachActivity"},
				attempts: {$sum:1},
				scoreAvgTeachActivity: {$avg:"$scoreTeachActivity"},
				maxScoreTeachActivity: {$max:"$scoreTeachActivity"},
				lastActivityHistory: {$last:"$_id"},
				idUser: {$last:"$idUser"},
				minScoreTeachActivity: {$min:"$scoreTeachActivity"},
				activitiesHistory: { $push: "$$ROOT" }
			}},
			{$project: {attempts:1,lastActivityHistory:1,scoreTotalTeachActivity:1,scoreAvgTeachActivity:1,maxScoreTeachActivity:1,idUser:1,minScoreTeachActivity:1,activitiesHistory:1}}
		], function (err, activitiesHistory) {
			if(!activitiesHistory.length) return res.json({message:"El Docente no ha realizado actividades",type:CTE.STATUS_CODE.INFORMATION})
			models.activityhistory.populate(
				activitiesHistory,
				[
					{path: "idUser", model:"adminuser"},
					{path: "_id.idChildren", model:"children"},
					{path: "_id.idActivity", model:"activity"},
					{path: "lastActivityHistory", model:"activityhistory"}
				],
				(err, activitiesHistoryP) => {
					var numbersActivities = activitiesHistoryP.map(e => {
						return e._id.idActivity.activityActivity
					}).filter(function(item, pos,array) {
						return array.indexOf(item) == pos
					}).sort()
					var activites = numbersActivities.map((e,i,a)=>{
						return activitiesHistoryP.filter(r => {return (r._id.idActivity.activityActivity == e && r._id.idChildren.statusChildren == CTE.STATUS_USER.ACTIVE)})
					})
					localsJade.dataCustom = activites

					var pathView = "views/reports/consultChildrensToTeacher.jade"

					var fn = jade.compileFile(pathView,{})
					var html = fn(localsJade)

					functions.htmlToPdf(html,filename(pathView) + ".pdf").then(function(data){
						var room = req.user.idUser
						req.io.sockets.in(room).emit("report:generated", data)
					})

					return res.json({html:html,localsJade:localsJade})
				})
		})
	})
})

router.post("/consult-step-act",(req,res)=>{
	var data = req.body,
		promises = [],
		numberStep,
		numberActivity,
		report,
		view


	if(data.consulStep != 0){
		numberStep = parseInt(data.consulStep)
		numberActivity = parseInt(data.consulAct)

		report = numberActivity ? 1 : 2
		view = report == 1 ? "views/reports/consultAct.jade" : "views/reports/consultSteps.jade"

	}else{
		view = "views/reports/listSteps.jade"
	}

	var filters
	if(numberActivity){
		filters = {
			steps:[numberStep],
			activities:[numberActivity]
		}
	}else if(numberStep){
		filters = {steps:[numberStep]}
	}else{
		filters = {}
	}

	var dataChildrens = []

	models.children.find({statusChildren:CTE.STATUS_USER.ACTIVE},(err,childrens) => {
		if(!childrens.length) return res.json({message:"No hay Niñ@s",statusCode:CTE.STATUS_CODE.INFORMATION})
		childrens.forEach(children => {
			var promise = children.getDataAll({filters:filters}).then(
				function(data){dataChildrens.push(data)},
				function(err){}
			)
			promises.push(promise)
		})
		Q.all(promises).then(
			function(data){
				localsJade.dataCustom = dataChildrens
				localsJade.dataGeneral.numberStep = numberStep
				localsJade.dataGeneral.numberActivity = numberActivity

				var fn = jade.compileFile(view,{})
				var html = fn(localsJade)

				functions.htmlToPdf(html,filename(view) + ".pdf").then(function(data){
					var room = req.user.idUser
					req.io.sockets.in(room).emit("report:generated", data)
					console.log(data)
				})

				return res.json({html:html,localsJade:localsJade})
			},
			function(err){console.log("reject")}
		)
	})
})

/*
	Renderiza una vista con la informacion detallada de un niñ@
		Informacion 
			Personal
			Padres
			Etapas
			Historial Actividades
			Actividades Validadas
	Request Data {String} id: Id niñ@
	Response: Render 'infoChildren'
*/

router.post("/report-final/",(req,res)=>{
	var data = req.body,
		idChildren = data.idChildrenFinal

	models.children.findOne({idChildren : idChildren},(err, children) => {
		if (err) {res.json(err)}
		if(!children) return res.json({"message":"¡Niñ@ no existe!", statusCode:CTE.STATUS_CODE.INFORMATION})
		
		children.getDataAll().then(
			function(data){
				localsJade.dataCustom = data
				var pathView = "views/reports/reportFinal.jade"
				var fn = jade.compileFile(pathView,{})
				var html = fn(localsJade)

				var nameFilePdf = filename(pathView) + ".pdf"
				var options = {
					format: "Letter",
					"orientation": "portrait",
					"base": "http://localhost:8000",
					"border": "2cm",
					"header": {"height": "2cm"},
					"footer": {"height": "2cm"}
				}
				functions.htmlToPdf(html,nameFilePdf,options).then(
					function(data){return res.download("public/temp/" + nameFilePdf)},
					function(err){return res.json(err)}
				)
			},
			function(err){return res.json(err)}
		)
	})

})


router.get("/info-children/:id",(req,res)=>{
	var id = req.params.id,
		data = {}

	models.children.findOne({idChildren : id})
	.populate("idParent.idParent")
	.exec((err, children) => {
		if (err) {res.json(err)}
		if(!children) return res.json({"message":"¡Niñ@ no existe!", statusCode:CTE.STATUS_CODE.INFORMATION})
			
		data.child = children
		data.parents = children.idParent.map(objParent => {return objParent.idParent})

		models.activityhistory.find({idChildren: children._id})
		.sort({date:-1})
		.populate("idActivity idUser idStep")
		.exec((err, activitiesH) => {
			if (err) return res.json({err:err})
			data.histories = activitiesH

			models.activityvalid.find({idChildren: children._id})
			.sort({date:-1})
			.populate("idActivity idUser idStep")
			.exec((err, activitiesV) => {
				if (err) return res.json({err:err})
				if(activitiesV) {
					data.activitiesValid = activitiesV
					models.stepvalid.find({idChildren:children._id})
					.sort({date:-1})
					.populate("idStep idUser")
					.exec((err,stepvalidChild) =>{
						if(err) return res.json({err:err})
						if(stepvalidChild){
							data.stepsValid = stepvalidChild
							res.render("infoChildren",{infoChildren: data})
						}
					})
				}
			})
		})
	})
})

//Exportar una variable de js mediante NodeJS
module.exports = router
