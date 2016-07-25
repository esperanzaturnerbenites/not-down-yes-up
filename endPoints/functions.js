var jade = require("jade"),
	Cryptr = require("cryptr"),
	cryptr = new Cryptr(process.env.SECRET_KEY),
	CTE = require("../CTE"),
	models = require("../models"),
	localsJade = {
		parserCustom: parserCustom,
		CTE: CTE
	}


Date.prototype.getStringCustom = function(){
	return this.toLocaleString("es-CO",{hour12:true})
}

function renderReportAge(params){
	return new Promise(function(resolve,reject){
		var fn = jade.compileFile(params.view,{})
		localsJade.dataCustom = params.data
		var html = fn(localsJade)
		resolve({data:html})
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
				console.log("holaaaa")
				if(err) return reject(err)
				if(adminuser) return reject(new Error("Ya existe un usuario de tipo "))
				resolve({data:{message:"Ok"}})
				
			})
		})
	})
}

function checkCountActivities(params,info){
	return new Promise(function(resolve,reject){
		models.activityhistory.count(
			{idChildren:params.idChildren,idActivity:params.idActivity,idStep:params.idStep},
			function(err,count){
				if(err) return reject(err)
				if(count < CTE.MIN_NUMBER_ACTIVITIES_HISTORIES_FOR_VALIDATE_ACTIVITY){
					reject({message:"Debe COmpletar por lo minimo " + CTE.MIN_NUMBER_ACTIVITIES_HISTORIES_FOR_VALIDATE_ACTIVITY + " actividdes parciales"})
				}else{
					resolve({message:"correcto"})
				}
			})
	})
}

function renderListUser(params){
	return new Promise(function(resolve,reject){
		models.adminuser.find(params.query)
		.populate("idUser")
		.exec(function(err,adminuser){
			if(err) return reject(err)
			localsJade.dataCustom = adminuser
			var fn = jade.compileFile(params.view,{})
			var html = fn(localsJade)
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
				resolve({message:"Observacion Añadida"})
			})
	})
}

function defaulFn(){
	return Promise.resolve("Success")
}

function checkActivities(params,data,res){
	return new Promise(function(resolve,reject){
		var userUser = params.userUser

		models.adminuser.findOne({userUser:userUser},function(err,adminuser){
			if(err) return reject(err)
			models.activityhistory.count({idUser:adminuser._id},function(err,status){
				if(err) return reject(err)
				if(status){
					reject({message: "El Usuario Tiene actividades Iniciadas. Inactivelo."})
				}else{
					resolve({message: "El usuario se puede Eliminar"})
				}
			})
		})

	})
}

function encryptPass(params,data,res){
	return new Promise(function(resolve,reject){
		data.passUser = cryptr.encrypt(params.passUser)
		resolve({message:"Encriptacion Correcta"})
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


module.exports = {
	addObservationChildren: addObservationChildren,
	checkActivities: checkActivities,
	checkCountActivities: checkCountActivities,
	checkNewAdminUser: checkNewAdminUser,
	defaulFn: defaulFn,
	encryptPass: encryptPass,
	groupHistoryActivitiesByStep: groupHistoryActivitiesByStep,
	parserCustom: parserCustom,
	renderListUser: renderListUser,
	groupStepsValids: groupStepsValids,
	renderReportAge: renderReportAge
}
