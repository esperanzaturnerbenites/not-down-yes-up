var jade = require("jade"),
	Cryptr = require("cryptr"),
	cryptr = new Cryptr(process.env.SECRETKEY),
	CTE = require("../CTE"),
	models = require("../models")

function renderReportAge(params){
	return new Promise(function(resolve,reject){
		var fn = jade.compileFile(params.view,{})
		var html = fn({data: params.data})
		resolve({data:html})
	})
}

function checkNewAdminUser(params,info){
	info.passUser = cryptr.encrypt(info.passUser)
	return new Promise(function(resolve,reject){
		models.user.findOne({idUser:params.idUser},function(err,user){
			if(err) return reject(err)
			if(!user) return reject({message:"El usuario No existe"})
			info.idUser = user._id
			resolve({data:{message:"Usuario Creado"}})
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
			var fn = jade.compileFile(params.view,{})
			var html = fn({data: adminuser})
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


module.exports = {
	renderReportAge: renderReportAge,
	checkActivities: checkActivities,
	encryptPass: encryptPass,
	addObservationChildren: addObservationChildren,
	renderListUser: renderListUser,
	groupHistoryActivitiesByStep: groupHistoryActivitiesByStep,
	checkNewAdminUser: checkNewAdminUser,
	checkCountActivities: checkCountActivities,
	defaulFn: defaulFn
}
