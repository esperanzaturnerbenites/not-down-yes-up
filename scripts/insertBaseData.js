process.env.SECRET_KEY = "V8=!N*k6Q-S_Auz?CHTM2F+"

var baseData = require("./resources/baseData.json"),
	mongoose = require("mongoose"),
	models = require("./../models"),
	Q = require("q"),
	Cryptr = require("cryptr"),
	cryptr = new Cryptr(process.env.SECRET_KEY),
	aPromises = []

mongoose.connect("mongodb://localhost/centerestimulation")


models.step.create(baseData.steps,function(err,steps){
	if(err) process.exit(1)

	console.log("Steps Create")
	models.activity.create(baseData.activities,function(err,activities){
		if(err) process.exit(1)
		console.log("Activities Create")
		baseData.users.forEach(e => {

			aPromises.push(new Promise(function(resolve,reject){
				models.user.create(e.user,function(err,user){
					if(err) reject()
					console.log("User Create")
					e.adminuser.forEach(adminuser => {
						adminuser.idUser = user._id
						adminuser.passUser = cryptr.encrypt(adminuser.passUser)
					})
					models.adminuser.create(e.adminuser,function(err,adminuser){
						if(err) reject()
						console.log("AdminUser Create")
						resolve()
					})
				})
			}))
		})
		Q.all(aPromises).then(function(data){
			process.exit()
		})

	})
})
