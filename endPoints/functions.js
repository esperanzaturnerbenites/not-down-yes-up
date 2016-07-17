var jade = require("jade"),
	Cryptr = require("cryptr"),
	cryptr = new Cryptr(process.env.SECRETKEY),
	CTE = require("../CTE"),
	models = require("../models")

function renderReportAge(params){
	var fn = jade.compileFile(params.view,{})
	var html = fn({data: params.data})
	return html
}

function checkActivities(params,data,res){
	var userUser = params.userUser

	models.adminuser.findOne({userUser:userUser},function(err,adminuser){
		console.log("-------")
		console.log(adminuser)
		console.log("-------")
		models.activityhistory.count({idUser:adminuser._id},function(err,status){
			console.log(status)
			if(!status){
				var msg = {
					msg: "Eliminacion incorrecta, Inactive el Usuario",
					statusCode: CTE.STATUS_CODE.NOT_OK
				}
				return res.json(msg)
			}
			console.log(".......")
			console.log(2)
			console.log(".......")
		})
	})
}

function encryptPass(params,data,res){
	data.passUser = cryptr.encrypt(params.passUser)
}

module.exports = {
	renderReportAge: renderReportAge,
	checkActivities: checkActivities,
	encryptPass: encryptPass
}
