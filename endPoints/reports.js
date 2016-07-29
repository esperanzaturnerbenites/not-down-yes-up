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
	filename = require("filename")

router.use(bodyParser.urlencoded({extended:false}))

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

/*
	Genera y Retorna los Reportes Generales
	Request Data {String} reportGeneral: reporte a generar
	Response {String}: html del reporte solicitado
*/
router.post("/general",(req,res)=>{
	var data = req.body,
		report = req.body.typeReportCollection

	/*
		report:
			0: Listado General Niñ@s
			1: Listado General Profesores
			2: Listado por Etapas
	*/
	var pathView = "views/reports/",
		fieldsPopulate = "",
		collection = "",
		func = false,
		query = {}

	if(report == "children"){
		pathView = pathView + "listChildren.jade"
		fieldsPopulate = ""
		collection = "children"
		if(!data.reportGeneralStatusEstimulationChildren){
			if(data.reportGeneralStatusChildren == "T"){
				query = {}
			}else if(data.reportGeneralStatusChildren == 0){
				query = {statusChildren:0}
			}else{return res.json({"msg":"Este Reporte No Existe", statusCode:CTE.STATUS_CODE.NOT_OK})}

		}else if(data.reportGeneralStatusEstimulationChildren){
			if(data.reportGeneralStatusEstimulationChildren == "T"){
				query = {statusChildren:1}
			}else if(data.reportGeneralStatusEstimulationChildren == 0){
				query = {statusChildren:1,statusChildrenEstimulation:0}
			}else if(data.reportGeneralStatusEstimulationChildren == 1){
				query = {statusChildren:1,statusChildrenEstimulation:1}
			}else if(data.reportGeneralStatusEstimulationChildren == 2){
				query = {statusChildren:1,statusChildrenEstimulation:2}
			}else if(data.reportGeneralStatusEstimulationChildren == 3){
				query = {statusChildren:1,statusChildrenEstimulation:3}
			}else{return res.json({"msg":"Este Reporte No Existe", statusCode:CTE.STATUS_CODE.NOT_OK})}

		}else{return res.json({"msg":"Este Reporte No Existe", statusCode:CTE.STATUS_CODE.NOT_OK})}

	}else if(report == "adminuser"){
		console.log("report-user")
		pathView = pathView + "listTeacher.jade"
		fieldsPopulate = "idUser"
		collection = "adminuser"
		if(data.reportGeneralStatusUser == "T"){
			query = {typeUser:CTE.TYPE_USER.TEACHER}
		}else if(data.reportGeneralStatusUser == 0){
			query = {typeUser:CTE.TYPE_USER.TEACHER,statusUser:0}
		}else if(data.reportGeneralStatusUser == 1){
			query = {typeUser:CTE.TYPE_USER.TEACHER,statusUser:1}
		}else{return res.json({"msg":"Este Reporte No Existe", statusCode:CTE.STATUS_CODE.NOT_OK})}
		
	}else{
		return res.json({"msg":"Este Reporte No Existe", statusCode:CTE.STATUS_CODE.NOT_OK})
	}

	models[collection].find(query)
	.populate(fieldsPopulate)
	.exec(function(err,documents){
		if (err) {res.json(err)}
		if(!documents.length) return res.json({"msg":"No hay Registrados", statusCode:CTE.STATUS_CODE.INFORMATION})

		localsJade.dataCustom = documents
		localsJade.forPdf = true

		if(func) localsJade.dataCustomFilter = func(documents)

		var fn = jade.compileFile(pathView,{})
		var html = fn(localsJade)
		
		var optionsPDF = {
			format: "Letter",
			"orientation": "landscape",
			"base": "http://localhost:8000"
		}
		pdf.create(html, optionsPDF).toFile("public/temp/" + filename(pathView) + ".pdf", function(err, data) {
			if (err) return console.log(err);
			console.log(data) // { filename: '/app/businesscard.pdf' } 
		})

		return res.json({html:html,locals:localsJade})
	})
})



/*
	Genera y Retorna los Reportes Generales
	Request Data {String} reportGeneral: reporte a generar
	Response {String}: html del reporte solicitado
*/

	/*
		report:
			0: Listado General Niñ@s
			1: Listado General Profesores
			2: Listado por Etapas
	*/
/*
router.post("/general-childrens",(req,res)=>{
	var report = req.body.reportGeneralStatusChildren

	var pathView = "views/reports/",
		fieldsPopulate = "",
		collection = "",
		func = false,
		query = {}

	if(report == 0){
		pathView = pathView + "listChildren.jade"
		fieldsPopulate = ""
		collection = "children"

	}else if(report == 1){
		pathView = pathView + "listTeacher.jade"
		fieldsPopulate = "idUser"
		collection = "adminuser"
		query = {typeUser:CTE.TYPE_USER.TEACHER}
		
	}else if(report == 2){
		pathView = pathView + "listSteps.jade"
		fieldsPopulate = "idChildren idUser idStep"
		collection = "stepvalid"
		func = functions["groupStepsValids"]
	}else{
		return res.json({"msg":"Este Reporte No Existe", statusCode:CTE.STATUS_CODE.NOT_OK})
	}

	models[collection].find(query)
	.populate(fieldsPopulate)
	.exec(function(err,documents){
		if (err) {res.json(err)}
		if(!documents.length) return res.json({"msg":"No hay Registrados", statusCode:CTE.STATUS_CODE.INFORMATION})

		localsJade.dataCustom = documents
		localsJade.forPdf = true

		if(func) localsJade.dataCustomFilter = func(documents)

		var fn = jade.compileFile(pathView,{})
		var html = fn(localsJade)
		
		var optionsPDF = {
			format: "Letter",
			"orientation": "landscape",
			"base": "http://localhost:8000"
		}
		pdf.create(html, optionsPDF).toFile("public/temp/" + filename(pathView) + ".pdf", function(err, data) {
			if (err) return console.log(err);
			console.log(data) // { filename: '/app/businesscard.pdf' } 
		})

		return res.json({html:html,locals:localsJade})
	})
})*/

//Exportar una variable de js mediante NodeJS
module.exports = router