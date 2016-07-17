var express = require("express"),
	models = require("./../models"),
	router = express.Router(),
	bodyParser = require("body-parser"),
	jade = require("jade")

router.use(bodyParser.urlencoded({extended:false}))

router.post("/consult-step-act",(req,res)=>{
	var data = req.body,
		steps = {}

	var report = data.consulAct ? 1 : 2

	console.log("report " + report)

	var view = report == 1 ? "views/reports/consultAct.jade" : "views/reports/consultSteps.jade"

	models.step.findOne({stepStep:data.consulStep},(err,step) => {
		if(err) return res.json({err:err})
		if(!step) return res.json({err:{message:"Not steps"}})
		steps.step = step

		models.stepvalid.find({idStep:step._id})
		.sort({idChildren : 1})
		.populate("idChildren idUser idStep")
		.exec((err, stephis) => {
			if (err) return res.json(err)
			if (!stephis) return res.json({"msg":"Stephis not found"})
			steps.stepsValid = stephis
			var idsChild = stephis.map(e => {return {idChildren:e.idChildren._id}})

			var queryActivity = {stepActivity:step.stepStep}
			if(report == 1) queryActivity.activityActivity = data.consulAct

			models.activity.find(queryActivity,(err,activities) =>{
				if(err) return res.json({err:err})
				if(!activities) return res.json({err:{message:"Not Activities"}})

				var queryStepActivity = {idStep:step._id, $or:idsChild}
				if(report == 1) queryStepActivity.idActivity = activities[0]._id

				models.activityvalid.find(queryStepActivity)
				.populate("idActivity idChildren idUser")
				.sort({idChildren : 1})
				.exec((err,activitiesValid) =>{
					if (err) return res.json(err)


					steps.activitiesValid = activitiesValid

					steps.countActivities = activities.length
					steps.activities = activities
					var fn = jade.compileFile(view,{})
					var html = fn({data: steps})
					return res.json({html:html})
				})
			})
		})
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
router.get("/info-children/:id",(req,res)=>{
	var id = req.params.id,
		data = {}

	models.children.findOne({idChildren : id})
	.populate("idParent.idParent")
	.exec((err, children) => {
		if (err) {res.json(err)}
		if(!children) {return res.json({"msg":"¡Niñ@ no existe!", statusCode:2})}
			
		data.child = children
		data.parents = children.idParent.map(objParent => {return objParent.idParent})

		models.activityhistory.find({idChildren: children._id})
		.sort({date:-1})
		.populate("idActivity idUser idStep")
		.exec((err, activitiesH) => {
			if (err) return res.json({err:err})
			if(!activitiesH) {return res.json({"msg":"Activities history not found"})}
			data.historys = activitiesH

			models.activityvalid.find({idChildren: children._id})
			.sort({date:-1})
			.populate("idActivity idUser idStep")
			.exec((err, activitiesV) => {
				if (err) return res.json({err:err})
				if(!activitiesV) {return res.json({"msg":"Activities valid not found"})}
				if(activitiesV) {
					data.valids = activitiesV
					models.stepvalid.find({idChildren:children._id})
					.sort({date:-1})
					.populate("idStep idUser")
					.exec((err,stepvalidChild) =>{
						if(err) return res.json({err:err})
						if(!stepvalidChild) return res.json({err:{message:"No tiene etapas - Valid"}})
						if(stepvalidChild){
							data.stepvalids = stepvalidChild
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
	var report = req.body.reportGeneral

	/*
		report:
			0: Listado General Niñ@s
			1: Listado General Profesores
			2: Listado por Etapas
	*/
	var pathView = "views/reports/"

	if(report == 0){
		pathView = pathView + "listChildren.jade"

		models.children.find({},function(err,childrens){
			if (err) {res.json(err)}
			if(!childrens.length) return res.json({"msg":"No hay Niños Registrados", statusCode:2})
			var html = compileFileReport(pathView,childrens)
			return res.json({html:html})
		})
	}else if(report == 1){
		pathView = pathView + "listTeacher.jade"

		models.adminuser.find({typeUser:1})
		.populate("idUser")
		.exec(function(err,teachers){
			if (err) {res.json(err)}
			if(!teachers.length) return res.json({"msg":"No hay Profesores Registrados", statusCode:2})
			var html = compileFileReport(pathView,teachers)
			return res.json({html:html})
		})
	}else if(report == 2){
		pathView = pathView + "listSteps.jade"

		models.stepvalid.find()
		.populate("idChildren idUser idStep")
		.exec(function(err,stepsValid){
			if (err) {res.json(err)}
			if(!stepsValid.length) return res.jsonv({"msg":"No hay Niñ@s Registrados", statusCode:2})

			var data = {}
			stepsValid.forEach(function(stepValid){
				if(!data[stepValid.idStep.stepStep]) data[stepValid.idStep.stepStep] = []
				data[stepValid.idStep.stepStep].push(stepValid)
			})
			var html = compileFileReport(pathView,data)
			return res.json({html:html})
		})
	}else{
		return res.json({"msg":"Este Reporte No Existe", statusCode:1})
	}
})

/*
	Retorna compilado(html) un archivo Jade
	@param {String} view: path del archivo jade
	@param {Object} data: datos para renderizar el template
	@return {String}: String html del template
*/
function compileFileReport(view,data){
	var fn = jade.compileFile(view,{})
	var html = fn({data: data})
	return html
}

//Exportar una variable de js mediante NodeJS
module.exports = router