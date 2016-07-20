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
			if(!user) return reject({message:"EL usuario No existe"})
			info.idUser = user._id
			resolve({data:{message:"Usuario Creado"}})
		})
	})
}
function renderListUser(params){
	return new Promise(function(resolve,reject){
		models.adminuser.find(params.query)
		.populate("idUser")
		.exec(function(err,adminuser){
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
				if(err) reject(err)
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
			console.log(adminuser)
			models.activityhistory.count({idUser:adminuser._id},function(err,status){
				if(status){
					console.log("reject")
					reject({message: "El Usuario Tiene actividades Iniciadas. Inactivelo."})
				}else{
					console.log("resolve")
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

module.exports = {
	renderReportAge: renderReportAge,
	checkActivities: checkActivities,
	encryptPass: encryptPass,
	addObservationChildren: addObservationChildren,
	renderListUser: renderListUser,
	checkNewAdminUser: checkNewAdminUser,
	defaulFn: defaulFn
}
