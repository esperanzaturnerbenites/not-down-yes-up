var express = require("express"),
	models = require("./../models"),
	CTE = require("./../CTE"),
	router = express.Router(),
	bodyParser = require("body-parser"),
	jade = require("jade"),
	functions = require("./functions"),
	localsJade = {
		dataGeneral:{},
		parserCustom: functions.parserCustom,
		CTE: CTE
	},
	pdf = require("html-pdf"),
	Q = require("q"),
	filename = require("filename"),
	mongoose = require("mongoose")

router.use(bodyParser.urlencoded({extended:false}))

router.post("/consult-teacher-activities",(req,res)=>{
	var data = req.body,
		numberStep = parseInt(data.consulTeacherStep)

	models.step.findOne({stepStep:numberStep},function(err,stepFind){
		models.activityhistory.aggregate([
			{$match: {idUser:mongoose.Types.ObjectId(data.consulTeacher),idStep:stepFind._id}},
			{$group: {
				//_id: {idChildren: "$idChildren",idActivity: "$idActivity"},
				_id: {idActivity: "$idActivity"},
				//scoreTotalTeachActivity: {$sum:"$scoreTeachActivity"},
				//scoreAvgTeachActivity: {$avg:"$scoreTeachActivity"},
				//max: {$max:"$scoreTeachActivity"},
				//idUser: {$last:"$idUser"},
				//min: {$min:"$scoreTeachActivity"},
				activitiesHistory: { $push: "$$ROOT" }
			}},
			{$project: {activitiesHistory:1}}
		], function (err, activitiesHistory) {
			/*models.adminuser.populate(activitiesHistory, {path: "idUser"},(err, activitiesHistoryU) => {
				models.children.populate(activitiesHistoryU, {path: "_id.idChildren"},(err, activitiesHistoryUC) => {
					models.activity.populate(activitiesHistoryUC, {path: "_id.idActivity"},(err, activitiesHistoryUCA) => {
						return res.json(activitiesHistoryUCA)
					})
				})
			})*/
			models.activityhistory.populate(
				activitiesHistory,
				[
					{path: "activitiesHistory.idActivity", model:"activity"},
					{path: "activitiesHistory.idStep", model:"step"},
					{path: "activitiesHistory.idUser", model:"adminuser"},
					{path: "activitiesHistory.idChildren", model:"children"},
					{path: "_id.idActivity", model:"activity"}
				],
				(err, activitiesHistoryP) => {
					return res.json(activitiesHistoryP)
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

	models.children.find({},(err,childrens) => {
		childrens.forEach(children => {
			var promise = children.getDataAll({
				filters:filters
			}).then(
				function(data){
					dataChildrens.push(data)
				},
				function(err){}
			)
			promises.push(promise)
		})
		Q.all(promises).then(
			function(data){
				localsJade.dataCustom = dataChildrens
				localsJade.dataGeneral.numberStep = numberStep
				localsJade.dataGeneral.numberActivity = numberActivity

				//return res.json(localsJade)

				var fn = jade.compileFile(view,{})
				var html = fn(localsJade)
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
		if(!children) {return res.json({"msg":"¡Niñ@ no existe!", statusCode:CTE.STATUS_CODE.INFORMATION})}
		
		children.getDataAll().then(
			function(data){
				localsJade.dataCustom = data
				var pathView = "views/reports/reportFinal.jade"
				var fn = jade.compileFile(pathView,{})
				var html = fn(localsJade)

				var nameFilePdf = filename(pathView) + ".pdf"
				functions.htmlToPdf(html,nameFilePdf).then(
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
		if(!children) {return res.json({"msg":"¡Niñ@ no existe!", statusCode:CTE.STATUS_CODE.INFORMATION})}
			
		data.child = children
		data.parents = children.idParent.map(objParent => {return objParent.idParent})

		models.activityhistory.find({idChildren: children._id})
		.sort({date:-1})
		.populate("idActivity idUser idStep")
		.exec((err, activitiesH) => {
			if (err) return res.json({err:err})
			if(!activitiesH) {return res.json({"msg":"Activities history not found"})}
			data.histories = activitiesH

			models.activityvalid.find({idChildren: children._id})
			.sort({date:-1})
			.populate("idActivity idUser idStep")
			.exec((err, activitiesV) => {
				if (err) return res.json({err:err})
				if(!activitiesV) {return res.json({"msg":"Activities valid not found"})}
				if(activitiesV) {
					data.activitiesValid = activitiesV
					models.stepvalid.find({idChildren:children._id})
					.sort({date:-1})
					.populate("idStep idUser")
					.exec((err,stepvalidChild) =>{
						if(err) return res.json({err:err})
						if(!stepvalidChild) return res.json({err:{message:"No tiene etapas - Valid"}})
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

/*
temp1.map(e => {
  var newElement = {}
  newElement.activity = e._id.idActivity
  newElement.activitiesHistory = e.activitiesHistory

  var childrens = {}

  e.activitiesHistory.forEach(ee => {
    if(!childrens[ee.idChildren.idChildren]) childrens[ee.idChildren.idChildren] = {}
    if(!childrens[ee.idChildren.idChildren].ah) childrens[ee.idChildren.idChildren].ah = []
    childrens[ee.idChildren.idChildren].ah.push(ee)
  })

  for (eee in childrens){
    console.log(childrens[eee])
    var totalScoreTeachActivity = 0
    childrens[eee].ah.forEach(aa => {
     totalScoreTeachActivity += aa.scoreTeachActivity
   })
    childrens[eee].totalScoreTeachActivity = totalScoreTeachActivity
    childrens[eee].avgScoreTeachActivity = totalScoreTeachActivity/childrens[eee].ah.length
  }

  newElement.activitiesHistoryFilter = childrens
 
 return newElement
})
*/