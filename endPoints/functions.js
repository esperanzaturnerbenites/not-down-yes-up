var jade = require("jade"),
	Cryptr = require("cryptr"),
	pdf = require("html-pdf"),
	cryptr = new Cryptr(process.env.SECRET_KEY),
	CTE = require("../CTE"),
	models = require("../models"),
	filename = require("filename"),
	localsJade = {
		parserCustom: parserCustom,
		CTE: CTE
	}


Date.prototype.getStringCustom = function(){
	return this.toLocaleString("es-CO",{hour12:true})
}

function renderReportAge(params,req){
	return new Promise(function(resolve,reject){
		var fn = jade.compileFile(params.view,{})
		localsJade.dataCustom = params.data
		var html = fn(localsJade)
		

		htmlToPdf(html,filename(params.view) + ".pdf").then(function(data){
			var room = req.user.idUser
			req.io.sockets.in(room).emit("report:generated", data)
		})

		resolve({data:html})
	})
}

function updateStatusChildrenEstimulation(params,info){
	return new Promise(function(resolve,reject){
		models.children.update(
			{_id:params.idChildren},
			{$set:{statusChildrenEstimulation:params.statusChildrenEstimulation}},
			function(err,status){
				if(err) return reject(err)
				resolve({data:{message:"Actualizacion de estado completada",statusCode:CTE.STATUS_CODE.OK}})
			})
	})
}
function checkNewAdminUser(params,info){
	info.passUser = cryptr.encrypt(info.passUser)

	return new Promise(function(resolve,reject){
		models.user.findOne({idUser:params.idUser},function(err,user){
			if(err) return reject(err)
			if(!user) return reject(new Error("El usuario No existe"))

			info.idUser = user._id
			models.adminuser.findOne({idUser:user._id,typeUser:params.typeUser},function(err,adminuser){
				if(err) return reject(err)
				if(adminuser) return reject(new Error("Ya existe un usuario de tipo."))
				resolve({data:{message:"El nuevo uuario se puede crear",statusCode:CTE.STATUS_CODE.OK}})
			})
		})
	})
}

function renderListUser(params,req){
	return new Promise(function(resolve,reject){
		models.adminuser.find(params.query)
		.populate("idUser")
		.exec(function(err,adminusers){
			if(err) return reject(err)
			localsJade.dataCustom = adminusers
			var fn = jade.compileFile(params.view,{})
			var html = fn(localsJade)

			htmlToPdf(html,filename(params.view) + ".pdf").then(function(data){
				var room = req.user.idUser
				req.io.sockets.in(room).emit("report:generated", data)
			})
			resolve({data:html})
		})
	})
}
function addObservationChildren(params){
	return new Promise(function(resolve,reject){
		models.children.update(
			{idChildren:params.idChildren},
			{
				$push: {
					observationChildren: {
						observation: "observacion completada",
						status: 1
					}
				}
			},
			function(err,children){
				if(err) return reject(err)
				resolve({message:"Observacion Añadida",statusCode:CTE.STATUS_CODE.OK})
			})
	})
}

function defaulFn(){return Promise.resolve("Success")}

function checkActivities(params,data){
	return new Promise(function(resolve,reject){
		var userUser = params.userUser

		models.adminuser.findOne({userUser:userUser},function(err,adminuser){
			if(err) return reject(err)
			models.activityhistory.count({idUser:adminuser._id},function(err,quantity){
				if(err) return reject(err)
				if(quantity){
					reject(new Error("El Usuario tiene actividades Iniciadas. Inactivelo."))
				}else{
					resolve({message: "El usuario se puede Eliminar",statusCode:CTE.STATUS_CODE.OK})
				}
			})
		})

	})
}

function encryptPass(params,data){
	return new Promise(function(resolve,reject){
		data.passUser = cryptr.encrypt(params.passUser)
		resolve({message:"Encriptacion Correcta",statusCode:CTE.STATUS_CODE.OK})
	})
}

function groupStepsValids(stepsValid){
	var data = {}
	stepsValid.forEach(function(stepValid){
		if(!data[stepValid.idStep.stepStep]) data[stepValid.idStep.stepStep] = []
		data[stepValid.idStep.stepStep].push(stepValid)
	})
	return data
}

/* estimulation.js */
function groupHistoryActivitiesByStep(historyActivities){
	var dataFilter = {}
	historyActivities.forEach(activityHistory => {
		if(!dataFilter[activityHistory.idStep.stepStep]) dataFilter[activityHistory.idStep.stepStep] = []
		dataFilter[activityHistory.idStep.stepStep].push(activityHistory)
	})
	return dataFilter
}
/* estimulation.js */

/* templates jade */
function parserCustom(data,cte){
	return CTE.FN[cte].getString(data)
}
/* templates jade */

function htmlToPdf(stringHTML,nameFile,options){
	return new Promise(function(resolve,reject){
		var optionsDefault = {
			format: "Letter",
			"orientation": "landscape",
			"base": "http://localhost:8000",
			"border": "0cm",
			"header": {"height": "2cm"},
			"footer": {"height": "2cm"}
		}
		options = options ? options : optionsDefault
		pdf.create(stringHTML, options).toFile("public/temp/" + nameFile, function(err, data) {
			if (err) reject(err)
			resolve(data)
		})
	})
}


module.exports = {
	addObservationChildren: addObservationChildren,
	checkActivities: checkActivities,
	checkNewAdminUser: checkNewAdminUser,
	defaulFn: defaulFn,
	encryptPass: encryptPass,
	groupHistoryActivitiesByStep: groupHistoryActivitiesByStep,
	parserCustom: parserCustom,
	renderListUser: renderListUser,
	groupStepsValids: groupStepsValids,
	updateStatusChildrenEstimulation: updateStatusChildrenEstimulation,
	htmlToPdf: htmlToPdf,
	renderReportAge: renderReportAge
}
