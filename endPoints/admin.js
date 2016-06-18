var express = require("express"),
	models = require("./../models"),
	mongoose = require("mongoose"),
	router = express.Router(),
	bodyParser = require("body-parser"),
	querystring = require("querystring"),
	ObjectId = mongoose.Types.ObjectId,
	multer = require("multer"),
	upload = multer({ dest: "public/img/users" }),
	Q = require("q")

router.use(bodyParser.urlencoded({extended:true}))
router.use(bodyParser.json())

router.post("/found-users",(req,res)=>{
	var data = req.body

	models.user.findOne({idUser : data.adminOpeTeachAdmin}, (err,user) => {
		if(err) return res.json({err:err})
		if(user) return res.json(user)
		return res.json({msg:"¡Usuario no existe!", statusCode:2})
	})
})

router.post("/found-childrens",(req,res)=>{
	var data = req.body

	models.children.findOne({idChildren : data.adminInfoChildren}, (err,children) => {
		if(err) return res.json({err:err})
		if(children) return res.json(children)
		return res.json({msg:"¡Niñ@ no existe!", statusCode:2})
	})
})

router.get("/menu-admin",(req,res)=>{
	res.render("menuAdmin",{user :req.user})
})

router.get("/admin-steps",(req,res)=>{
	var data = {}

	models.step.find({})
	.sort({stepStep:1})
	.exec((err,steps)=>{
		if(err) return res.json({err:err})
		if(!steps) return res.json({msg:"Not Steps",statusCode:0})
		if(steps){
			data.steps = steps

			models.activity.find({stepActivity:steps[0].stepStep})
			.sort({activityActivity:1})
			.exec((err,activities)=>{
				if(err) return res.json({err:err})
				if(!activities) return res.json({msg:"Not Activities",statusCode:0})
				if(activities){
					data.activities = activities
					res.render("adminSteps",{user :req.user, data:data})
				}
			})
		}
	})
})

router.get("/admin-activities",(req,res)=>{
	var data = {}

	models.step.find({})
	.sort({stepStep:1})
	.exec((err,steps)=>{
		if(err) return res.json({err:err})
		if(!steps) return res.json({msg:"Not Steps",statusCode:0})
		if(steps){
			data.steps = steps

			models.activity.find({stepActivity:steps[0].stepStep})
			.sort({activityActivity:1})
			.exec((err,activities)=>{
				if(err) return res.json({err:err})
				if(!activities) return res.json({msg:"Not Activities",statusCode:0})
				if(activities){
					data.activities = activities
					res.render("adminActs",{user :req.user, data:data})
				}
			})
		}
	})
})

router.post("/found-all-step-activities",(req,res)=>{
	var data = {}

	models.step.find({})
	.sort({stepStep:1})
	.exec((err,steps)=>{
		if(err) return res.json({err:err})
		if(!steps) return res.json({msg:"Not Steps",statusCode:0})
		if(steps){
			data.steps = steps

			models.activity.find({stepActivity:steps[0].stepStep})
			.sort({activityActivity:1})
			.exec((err,activities)=>{
				if(err) return res.json({err:err})
				if(!activities) return res.json({msg:"Not Activities",statusCode:0})
				if(activities){
					data.activities = activities
					res.json({data:data})
				}
			})
		}
	})
})

router.post("/found-steps-acts",(req,res)=>{
	var data = req.body

	models.step.findOne({stepStep:data.stepStep},(err,steps)=>{
		if(err) return res.json({err:err})
		if(!steps) return res.json({msg:"Not Steps",statusCode:0})
		data.steps = steps
		console.log(data)

		models.activity.find({stepActivity:steps.stepStep})
		.sort({activityActivity:1})
		.exec((err,activities)=>{
			if(err) return res.json({err:err})
			if(!activities) return res.json({msg:"Not Activities",statusCode:0})
			if(activities){
				data.activities = activities
				res.json({data:data})
			}
		})
	})
})

router.post("/consul-step-acts",(req,res)=>{
	var data = req.body,
		steps = {}

	models.activity.find({stepActivity:data.stepStep})
	.sort({activityActivity:1})
	.exec((err,stepActs) =>{
		if(err) return res.json({err:err})
		if(stepActs.length < 1) return res.json({err:{message:"Not Activities"}})
		steps = stepActs
		return res.json({msg : "Consult Complete", steps :steps})
	})
})

router.post("/consul-acts",(req,res)=>{
	var data = req.body,
		activities = {}

	models.activity.findOne({stepActivity:data.stepActivityEdit, activityActivity:data.activityActivityEdit},(err,acts) =>{
		if(err) return res.json({err:err})
		if(acts.length < 1) return res.json({err:{message:"Not Activities"}})
		activities = acts
		return res.json({msg : "Consult Complete", activities :activities})
	})
})

router.post("/upload",upload.any(),(req,res)=>{
	/*
				models.step.find({}, (err, steps) => {
					if(err) return res.json({err:err})
					if(!steps.length) return res.json({msg:"Not steps"})

					for(var step of steps){
						promises.push(models.stepvalid.create({idStep:step._id, idUser:req.user._id, idChildren:children._id}))
					}
					Q.all(promises).then(function (result) {
						console.log(result)
					})
				})*/

				models.step.find({}, (err, steps) => {
					if(err) return res.json({err:err})
					if(!steps.length) return res.json({msg:"Not steps"})
					console.log(steps)

					for(var step in steps){
						console.log(step)
					}
					return res.send("ok")
				})
})

//router.post("/register-children",upload.any(),(req,res)=>{
	
var createChildren =  (dataChildren,dataMom,dataDad,dataCare,req,res) => {
	var promises = []
	if(dataMom.idParent == dataDad.idParent || dataMom.idParent == dataCare.idParent || dataDad.idParent == dataCare.idParent || dataChildren.idChildren == dataMom.idParent || dataChildren.idChildren == dataDad.idParent || dataChildren.idChildren == dataCare.idParent){
		req.flash("success","¡Números de identificación iguales")
		res.redirect(req.get("referer"))
		//res.json({err:{message : "¡Números de identificación iguales"}})
	}else{

		var queryParents = [
			{idParent : dataMom.idParent},
			{idParent : dataDad.idParent},
			{idParent : dataCare.idParent}
		]

		var idParents = [
			{idParent : dataMom.idParent,relationshipParent:0},
			{idParent : dataDad.idParent,relationshipParent:1},
			{idParent : dataCare.idParent,relationshipParent:2}
		]

		var arrayParents = [dataMom, dataDad, dataCare]

		models.parent.create(arrayParents,(err, parentsCreate) => {
			if(err) {
				if(err.message != "¡Familiar ya existe!") return res.json({err:err})
			}

			var parentsChildren = []

			models.parent.find({$or:queryParents},{_id:1,idParent:1},(err, parentsFind) => {
				idParents.forEach(parent => {
					var parentTemp = parentsFind.find(parentFind => {return parentFind.idParent == parent.idParent})
					parentTemp.relationshipParent = parent.relationshipParent
					parentsChildren.push({idParent:parentTemp._id,relationshipParent:parent.relationshipParent})
				})

				dataChildren.idParent = parentsChildren

				models.children.create(dataChildren, function (err, children) {
					if(err) return res.json({err:err})

					models.step.find({}, (err, steps) => {
						if(err) return res.json({err:err})
						if(!steps.length) return res.json({msg:"Not steps"})

						for(var stepDB of steps){
							promises.push(models.stepvalid.create({idStep:stepDB._id, idUser:req.user._id, idChildren:children._id}))
						}

						Q.all(promises).then(function 	() {
							return res.redirect("/admin/menu-admin")
						})

					})
				})
			})
		})
	}
}

var updateChildren =  (dataChildren,dataMom,dataDad,dataCare,req,res) => {


	models.children.findOneAndUpdate(
		{idChildren : dataChildren.idChildren},
		{"$set": dataChildren},
	(err,children) => {
		if(err) return res.json({err:err})

		var data = {},
			promises = []

		children.idParent.forEach(objIdParen => {
			if(objIdParen.relationshipParent == 0) data = dataMom
			if(objIdParen.relationshipParent == 1) data = dataDad
			if(objIdParen.relationshipParent == 2) data = dataCare
			console.log(objIdParen.idParent)
			var promise = models.parent.update(
				{_id:objIdParen.idParent},
				{$set:data}
				)
			promises.push(promise)
		})
		Q.all(promises).then(() => {
			return res.json("update listo")
		})
	})
}

router.post(["/update-children","/register-children"],upload.any(),(req,res)=>{
	//console.log("init")

	var fileChildren =  req.files.find(e => {return e.fieldname == "imgChildren"}),
		fileMom = req.files.find(e => {return e.fieldname == "imgMom"}),
		fileDad =  req.files.find(e => {return e.fieldname == "imgDad"}),
		fileCure =  req.files.find(e => {return e.fieldname == "imgCure"})

	//return res.json(req.files)

	var defaultImage = "defaultUser.png",
		imgChildren =  fileChildren ? fileChildren.filename : defaultImage,
		imgMom =  fileMom ? fileMom.filename : defaultImage,
		imgDad =  fileDad ? fileDad.filename : defaultImage,
		imgCure =  fileCure ? fileCure.filename : defaultImage

	var data = req.body,
		dataChildren = {
			abilityChildren : data.abilityChildren,
			addressChildren : data.addressChildren,
			ageChildren : data.ageChildren,
			apbChildren : data.apbChildren,
			birthdateChildren : new Date(data.birthdateChildren.split("-")),
			birthplaceChildren : data.birthplaceChildren,
			debilityChildren : data.debilityChildren,
			departamentChildren : data.departamentChildren,
			districtChildren : data.districtChildren,
			epsChildren : data.epsChildren,
			genderChildren : data.genderChildren,
			glassesChildren : data.glassesChildren,
			healthChildren : data.healthChildren,
			hearingaidChildren : data.hearingaidChildren,
			idChildren : data.idChildren,
			imgChildren : imgChildren,
			lastnameChildren : data.lastnameChildren,
			levelhomeChildren : data.levelhomeChildren,
			liveSon : data.liveSon,
			localityChildren : data.localityChildren,
			municipalityChildren : data.municipalityChildren,
			nameChildren : data.nameChildren
		},
		dataMom = {
			imgParent : imgMom,
			birthdateParent : new Date(data.birthdateParent[0].split("-")),
			celParent : data.celParent[0],
			emailParent : data.emailParent[0],
			idExpeditionParent : data.idExpeditionParent[0],
			idParent : data.idParent[0],
			jobParent : data.jobParent[0],
			lastnameParent : data.lastnameParent[0],
			nameParent : data.nameParent[0],
			professionParent : data.professionParent[0],
			relationshipParent : 0,
			studyParent : data.studyParent[0],
			telParent : data.telParent[0]
		},
		dataDad = {
			imgParent : imgDad,
			birthdateParent : new Date(data.birthdateParent[1].split("-")),
			celParent : data.celParent[1],
			emailParent : data.emailParent[1],
			idExpeditionParent : data.idExpeditionParent[1],
			idParent : data.idParent[1],
			jobParent : data.jobParent[1],
			lastnameParent : data.lastnameParent[1],
			nameParent : data.nameParent[1],
			professionParent : data.professionParent[1],
			relationshipParent : 1,
			studyParent : data.studyParent[1],
			telParent : data.telParent[1]
		},
		dataCare = {
			imgParent : imgCure,
			birthdateParent : new Date(data.birthdateParent[2].split("-")),
			celParent : data.celParent[2],
			emailParent : data.emailParent[2],
			idExpeditionParent : data.idExpeditionParent[2],
			idParent : data.idParent[2],
			lastnameParent : data.lastnameParent[2],
			nameParent : data.nameParent[2],
			relationshipParent : 2,
			telParent : data.telParent[2]
		}
	if(eval(data.editingChildren)){
		updateChildren(dataChildren,dataMom,dataDad,dataCare,req,res)
	}else{
		createChildren(dataChildren,dataMom,dataDad,dataCare,req,res)
	}
})

router.get("/register-children/:id?",(req,res)=>{
	var id = req.params.id

	if(!id) return res.render("registerChildren")
		
	models.children.findOne({idChildren:id}).populate('idParent.idParent').exec((err,childrenSearch) =>{
		if (err) return {err : err}


		var mom = childrenSearch.idParent.find(parent => {return parent.relationshipParent == 0}),
			dad = childrenSearch.idParent.find(parent => {return parent.relationshipParent == 1}),
			cure = childrenSearch.idParent.find(parent => {return parent.relationshipParent == 2})
		//return res.json(mom)
		res.render("registerChildren",
			{
				data: {
					children : childrenSearch,
					parents : {
						mom : mom.idParent,
						dad : dad.idParent,
						cure : cure.idParent
					}
				}
			}
		)
	})
})

router.post("/valid-children",(req,res)=>{
	var data = req.body

	models.children.findOne({idChildren : data.validChildren},(err,exists) => {
		if(err) return res.json({err:err})
		if(exists) res.json({valid:false, msg:"¡Niñ@ ya existe!", statusCode:2})
		else res.json({valid:true, msg:"", statusCode:1})
	})
})

router.get("/register-user/:id?",(req,res)=>{
	var id = req.params.id
	if(!id) return res.render("registerUserRol")
	console.log(id)

	models.user.findOne({idUser:id}).exec((err,userSearch) =>{
		if (err) return {err : err}
		return res.render("registerUserRol",{userEdit: userSearch})
	})
})

router.post("/register-user",upload.any(),(req,res)=>{


	var dataUser = {
			validUser : req.body.validUser,
			idUser : req.body.idUser,
			expeditionUser : req.body.expeditionUser,
			nameUser : req.body.nameUser,
			lastnameUser : req.body.lastnameUser,
			ageUser : req.body.ageUser,
			imgUser : req.body.imgUser,
			telUser : req.body.telUser,
			celUser : req.body.celUser,
			emailUser : req.body.emailUser,
			addressUser : req.body.addressUser,
			districtUser : req.body.districtUser,
			localityUser : req.body.localityUser,
			municipalityUser : req.body.municipalityUser,
			departamentUser : req.body.departamentUser,
			studyUser : req.body.studyUser,
			professionUser : req.body.professionUser,
			experienceUser : req.body.experienceUser,
			centerUser : req.body.centerUser
		},
		dataUserAdmin = {
			typeUser :req.body.typeUser,
			userUser :req.body.userUser,
			passUser :req.body.passUser,
			passConfirmUser :req.body.passConfirmUser
		}

		
	var fileUser =  req.files.find(e => {return e.fieldname == "imgUser"})
	//return res.json(req.files)

	var defaultImage = "defaultUser.png"
	dataUser.imgUser = fileUser ? fileUser.filename : defaultImage

	//console.log(dataUser)
	if(dataUserAdmin.passUser == dataUserAdmin.passConfirmUser){

		models.adminuser.findOne({userUser : dataUserAdmin.userUser}, (err, adminFind) => {
			if(err) return res.json({err:err})
			if(adminFind) return res.json({err:{message:"¡Usuario de logueo ya existe!"}})
			if(!adminFind){
				models.user.create(dataUser, function (err, user) {
					if(err) return res.json({err:err})
					dataUserAdmin.idUser = user._id
					dataUserAdmin.statusUser = 1
					delete dataUserAdmin.passConfirmUser
					console.log(dataUserAdmin)
					
					models.adminuser.create(dataUserAdmin, function (err, adminuser) {
						if(err) return res.json({err:err})
						return res.redirect("/admin/menu-admin")
					})
				})
			}
		})
	}else return res.json({err:{message:"¡Contraseña no coincide!"}})
})

router.get("/info-user/:id",(req,res)=>{
	var id = req.params.id,
		data = {}
	models.user.findOne({idUser:id}).exec((err,userFind) =>{
		if (err) return res.json({err:err})
		if (!userFind) return res.json({err:{message:"User not exist"}})
		if(userFind){
			data.user = userFind
			models.adminuser.find({idUser:userFind._id},(err,adminU) =>{
				if(err) return res.json({err:err})
				if(!adminU) return res.json({msg:"No users asigned"})
				data.admin = adminU

				var adminuserTeacher = adminU.find(adminuser => {
					return adminuser.typeUser == 1
				})

				console.log(adminuserTeacher)

				if(adminuserTeacher){
					models.activityhistory.aggregate([
						{$match: {idUser:adminuserTeacher._id}},
						{$group: {
							_id: "$idChildren"
						}}
					], function (err, hisact) {
						models.children.populate(hisact, {path: "_id"},(err, hisactP) => {
							var childrens = hisactP.map(his => {
								return his._id
							})
							childrens.sort(function(a, b){return a < b})
							data.childrens = childrens
							res.render("infoUserRol",{infoUser: data})
						})
					})
				}else return res.render("infoUserRol",{infoUser: data})

				
				/*models.activityhistory.find({idUser:adminuserTeacher._id})
				.populate("idChildren idActivity")
				.sort({idChildren:1})
				.exec((err,hisact) =>{
					if(err) return res.json({err:err})
					if(!hisact) return res.json({err:{message:"No tiene actividades"}})
					if(hisact){
						data.children = hisact
						data.childrens = hisact.map(his => {
							return his.idChildren
						})
						console.log(data)
						res.render("infoUserRol",{infoUser: data})
					}
				})*/

				/*models.activityhistory.aggregate([
					{$group:{_id:"idChildren"}}]),
					function(err,doc){
						console.log(data.admin)
						models.activityhistory.populate(doc,{"path":"idChildren"},function(err,doc){
							if(err) return res.json({err:err})
							if(doc){
								data.children = doc
								res.render("infoUserRol",{infoUser: data})
							}
						})
					}*/


			})
		}
	})
})

router.post("/update-user",(req,res)=>{
	
	var dataUser = req.body

	console.log(dataUser)

	models.user.update(
		{idUser : dataUser.idUser},
		{"$set": dataUser}
		,(err) => {
			if(err) return res.json({err:err})
			return res.json({msg:"¡Usuario actualizado con éxito!", statusCode : 0})

		})
})

router.post("/valid-user",(req,res)=>{
	var data = req.body

	models.user.findOne({idUser : data.validUser},(err,exists) => {
		if(err) return res.json({err:err})
		if(exists){
			res.json({valid:false, msg:"¡Usuario ya existe!", statusCode:2})
		}else{
			res.json({valid:true, msg:"", statusCode:1})
		}
	})
})

router.post("/register-newuser",(req,res)=>{
	var data = req.body
	//console.dir(data)

	if(data.passUser == data.newPassConfirmUser){

		models.adminuser.findOne({userUser : data.userUser}, (err, adminFind) => {
			if(err) return res.json({err:err})
			if(adminFind) return res.json({err:{message:"¡Usuario de logueo ya existe!"}})
			if(!adminFind){

				models.user.findOne({idUser : data.idUser},(err,user) => {
					if(err) return res.json({err:err})
					if(!user) return res.json({msg:"¡Usuario no existe!", statusCode:2})
					if(user){

						models.adminuser.find({idUser:user._id, typeUser:data.typeUser}, (err, admType) => {
							if(err) return res.json({err:err})
							if(admType) return res.json({msg:"¡Usuario ya tiene asignado este rol!", statusCode:2})
							
							data.idUser = user._id

							models.adminuser.create(data, function (err, adminuser) {
								if(err) return res.json({err:err})
								if(adminuser) return res.json({msg:"¡Usuario de logueo registrado con éxito!", statusCode : 0})
							})
						})
					}
				})
			}
		})

		
	}else return res.json({msg:"¡Contraseña no coincide!", statusCode : 1})
})

router.get("/admin-users",(req,res)=>{
	res.render("adminUsers")
})

router.get("/admin-childrens",(req,res)=>{
	res.render("adminChildrens")
})

router.get("/info-children/:id",(req,res)=>{
	var id = req.params.id,
		data = {}

	models.children.findOne({idChildren:id})
	.populate('idParent.idParent')
	.exec((err,childrenFind) =>{
		if(err) return res.json({err:err})
		if(!childrenFind) return res.json({err:{message:"Children not exist"}})
		if(childrenFind){
			data.child = childrenFind

			data.parents = childrenFind.idParent.map(objParent => {return objParent.idParent})

			models.activityhistory.find({idChildren:childrenFind._id})
			.sort({date:-1})
			.populate("idActivity idStep idUser")
			.exec((err,acthisChild) =>{
				if(err) return res.json({err:err})
				if(!acthisChild) return res.json({msg:"No tiene actividades - History"})
				//console.log(acthisChild)
				data.historys = acthisChild
				
				models.activityvalid.find({idChildren:childrenFind._id})
				.sort({date:-1})
				.populate("idStep idActivity idUser")
				.exec((err,actvalidChild) =>{
					if(err) return res.json({err:err})
					if(!actvalidChild) return res.json({err:{message:"No tiene actividades - Valid"}})
					data.valids = actvalidChild
					
					models.stepvalid.find({idChildren:childrenFind._id})
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
				})
			})
		}
	})
})

router.get("/valid-step",(req,res)=>{
	res.render("validStep")
})

router.post("/find-all",(req,res)=>{
	var data = req.body
	console.log(data)
	if(data.typeUser == "2"){
		models.adminuser.find({typeUser : {$ne : "2"}})
		.populate("idUser")
		.exec((err,users) =>{
			if(err) return res.json({err:err})
			res.json(users)
		})
	}else{
		models.adminuser.find({typeUser : data.typeUser})
		.populate("idUser")
		.exec((err,users) =>{
			if(err) return res.json({err:err})
			res.json(users)
		})
	}
})

router.post("/update-pass",(req,res)=>{
	var data = req.body
	
	if(data.adminIdUser == "Developer"){
		return res.json({err:{message:"¡Contraseña no puede ser actualizada!"}})
	}else{
		models.adminuser.findOneAndUpdate(
			{userUser : data.adminIdUser},
			{$set:{passUser:data.adminPassUser}},
			(err,doc) => {
				if(err) return res.json({err:err})
				if(doc) return res.json({msg:"¡Contraseña actualizada con éxito!", statusCode:0, adminuser : doc})
				if(!doc) return res.json({msg:"¡Usuario de logueo no existe!", statusCode:2})
			})
	}
})

router.post("/inactivate-children",(req,res)=>{
	var data = req.body
	
	models.children.findOneAndUpdate(
		{idChildren : data.adminUpdChildren},
		{$set:{statusChildren:3, observationChildren:data.observationChildren}},
		(err,doc) => {
			if(err) return res.json({err:err})
			if(doc) return res.json({msg:"¡Estado actualizado con éxito!", statusCode:0})
			if(!doc) return res.json({msg:"Niñ@ no existe!", statusCode:2})
		})
})

router.post("/update-rol",(req,res)=>{
	var data = req.body
	
	if(data.adminRolIdUser == "Developer" || data.adminRolIdUser == req.user.userUser){
		return res.json({err:{message:"Rol no puede ser actualizado!"}})
	}else{
		models.adminuser.findOneAndUpdate(
			{userUser : data.adminRolIdUser},
			{$set:{typeUser:data.rolUser}},
			(err,doc) => {
				if(err) return res.json({err:err})
				if(doc) return res.json({msg:"Rol actualizado con éxito!", statusCode:0, adminuser : doc})
				if(!doc) return res.json({msg:"¡Usuario de logueo no existe!", statusCode:2})
			})
	}
})

router.post("/update-status",(req,res)=>{
	var data = req.body
	
	if(data.adminStaIdUser == "Developer" || data.adminStaIdUser == req.user.userUser){
		return res.json({err:{message:"¡Estado no puede ser actualizado!"}})
	}else{
		models.adminuser.findOneAndUpdate(
			{userUser : data.adminStaIdUser},
			{$set:{statusUser:data.statusUser}},
			(err,doc) => {
				if(err) return res.json({err:err})
				if(doc) return res.json({msg:"Estado actualizado con éxito!", statusCode:0, adminuser : doc})
				if(!doc) return res.json({msg:"¡Usuario de logueo no existe!", statusCode:2})
			})
	}
})

//Delete children --- Metodo Agregate **********************************************
router.post("/delete-childrens",(req,res)=>{
	var data = req.body

	models.children.findOne({idChildren : data.adminOpeChildren},(err,children) => {
		if(err) return res.json({err:err})
		if(children){
			children.remove()
		}else{
			return res.json({msg:"¡Niñ@ no existe!", statusCode : 2})
		}
	})
})

router.post("/delete-users",(req,res)=>{
	var data = req.body

	if(data.adminOpeIdUser == "Developer"){
		return res.json({err:{message:"¡Usuario no puede ser eliminado"}})
	}else{
		models.adminuser.findOne({userUser:data.adminOpeIdUser, _id:{$ne : req.user._id}},(err,userD) => {
			if(err) return res.json({err:err})
			if(userD){
				models.activityhistory.find({idUser:userD._id},(err,acthis) =>{
					if(err) return res.json({err:err})
					if(acthis || userD.typeUser == 0) return res.json({err:{message:"¡Usuario no puede ser eliminado, INACTÍVELO!"}})
					models.adminuser.remove({userUser:data.adminOpeIdUser},(err) => {
						if(err) return res.json({err:err})
						return res.json({msg:"¡Usuario eiminado con éxito!", statusCode:0})
					})
				})
			}else return res.json({msg:"¡Usuario no existe!",statusCode:2})
		})
	}
})

router.post("/delete-teachadmin",(req,res)=>{
	var data = req.body

	models.user.findOne({idUser : data.adminOpeTeachAdmin},(err,user) => {
		if(err) return res.json({err:err})
		if(user){
			models.adminuser.find({idUser:user._id},(err,adminU) => {
				var userhis = [],
					userteach = 0

				for(var admin of adminU){
					if(admin.typeUser == 1){userteach++}

					models.activityhistory.find({idUser:admin._id},(err,acthisFind) => {
						if(err) return res.json({err:err})
						if(acthisFind){
							userhis.push(admin._id)
						}
					})
				}

				if(userhis.length == 0 && userteach > 0){
					models.user.remove({idUser : data.adminOpeTeachAdmin},(err) => {
						if(err) return res.json({err:err})

						models.adminuser.remove({idUser : user._id},(err) => {
							if(err) return res.json({err:err})
							return res.json({msg:"¡Usuario eliminado con éxito!", statusCode:0})
						})
					})
				}else return res.json({err:{message:"¡Usuario no puede ser eliminado, INACTÍVELO!"}})
			})

		}else return res.json({msg:"¡Usuario no existe!",statusCode:2})
	})
})

router.post("/show-valid-step",(req,res)=>{
	var data = req.body

	models.children.findOne({idChildren : data.idChildren}, (err,children) => {
		if(err) return res.json({err:err})
		if(!children) return res.json({msg:"¡Niño no existe!", statusCode:2})

		models.step.findOne({stepStep : data.step}, (err,stepFind) => {
			if(err) return res.json({err:err})
			if(!stepFind) return res.json({msg:"Step not found"})

			models.activityvalid.find({idChildren : children._id, idStep : stepFind._id})
			.populate("idActivity idUser idChildren")
			.exec((err, activitiesvalid) => {
				if (err) return res.json({err: err})
				return res.json({msg:"¡Correcto!", statusCode:0, activitiesvalid:activitiesvalid, children:children, step:stepFind})
			})
		})
	})
})

router.post("/valid-step",(req,res)=>{
	var data = req.body

	data.idUser = req.user._id

	//console.log(data)

	models.children.findOne({idChildren : data.idChildren},(err,children) => {
		if(err) return res.json({err:err})
		data.idChildren = children._id

		models.step.findOne({_id : data.idStep},(err,step) => {
			if(err) return res.json({err:err})
			data.idStep = step._id

			models.stepvalid
			.findOne({idChildren : children._id, idStep : step._id},
			(err,stephis) => {
				if(err) return res.json({err:err})
				if(stephis){
					models.stepvalid.update(
					{idChildren : children._id, idStep : step._id},
					{"$set": data},
					(err,doc) => {
						models.children.findOneAndUpdate(
						{idChildren : children.idChildren},
						{$set:{statusChildren:2}},
						(err,activity) => {
							if(err) return res.json({err:err})
							if(doc) return res.json({msg:"¡Validación Semestral de Etapa Exitosa!", statusCode:0, activity:doc})
						})


					})
				}
			})
		})
	})
})

router.post("/update-teachAdmin",(req,res)=>{
	data = req.body

	models.user.findOne({idUser : data.adminOpeTeachAdmin},(err,exists) => {
		if(err) return res.json({err:err})
		if(exists){
			res.json({valid:true, msg:"",statusCode:1})
		}else{
			res.json({valid:false, msg:"User not found",statusCode:0})
		}
	})
})

router.get("/reports",(req,res)=>{
	var data = {}

	models.step.find({},(err,steps)=>{
		if(err) return res.json({err:err})
		if(!steps) return res.json({msg:"Not Steps",statusCode:0})
		if(steps){
			data.steps = steps

			models.activity.find({stepActivity:1},(err,activities)=>{
				if(err) return res.json({err:err})
				if(!activities) return res.json({msg:"Not Activities",statusCode:0})
				if(activities){
					data.activities = activities
					res.render("report", {reportData:data})
				}
			})
		}
	})
})

router.get("/backup",(req,res)=>{
	res.render("backup")
})

router.post("/add-step",(req,res)=>{
	var data = req.body

	data.urlStep = "/estimulation/steps/" + data.stepStep
		
	models.step.findOne({stepStep : data.stepStep}, (err, step) => {
		if(err) return res.json({err:err})
		if(step) return res.json({err:{message:"¡Etapa ya existe!, Etapa: " + step.stepStep + ": " + step.nameStep}})
		models.step.create(data, function (err, stepC) {
			if(err) return res.json({err:err})
			if(stepC) return res.json({msg:"¡Etapa registrada con éxito!", statusCode:0})
			
		})
	})
})

router.post("/save-edit-step",(req,res)=>{
	var data = req.body

	models.step.findOneAndUpdate(
		{stepStep : data.stepStepEdit},
		{$set:{nameStep:data.nameStep, descriptionStep:data.descriptionStep}
		},
		(err,doc) => {
			if(err) return res.json({err:err})
			if(doc) return res.json({msg:"¡Etapa actualizada con éxito!", statusCode:0})
			if(!doc) return res.json({msg:"¡Etapa no existe!", statusCode:2})
		})
})

router.post("/delete-step",(req,res)=>{
	var data = req.body

	models.step.findOne({stepStep:data.stepDel},(err,step) => {
		if(err) return res.json({err:err})
		if(step){
			models.step.remove({stepStep:data.stepDel},(err) => {
				if(err) return res.json({err:err})
				models.activity.remove({stepActivity:data.stepDel},(err) => {
					if(err) return res.json({err:err})
					return res.json({msg:"Etapa eliminada con éxito!", statusCode:0})
				})
			})
		}else return res.json({msg:"¡Etapa no existe!",statusCode:2})
	})
})

router.post("/add-activity",(req,res)=>{
	var data = req.body

	data.imgActivity = "/img/imgacts/activities/step" + data.stepActivity + "act" + data.activityActivity + ".png"
	data.audioActivity = "/audio/step" + data.stepActivity + "act" + data.activityActivity + ".mp3"
	data.urlActivity = "/estimulation/steps/" + data.stepActivity + "/" + data.activityActivity
		
	models.activity.findOne({stepActivity : data.stepActivity, activityActivity:data.activityActivity}, (err, acts) => {
		if(err) return res.json({err:err})
		if(acts) return res.json({err:{message:"¡Actividad ya existe!, Actividad: " + acts.activityActivity + ": " + acts.nameActivity}})
		models.activity.create(data, function (err, actC) {
			if(err) return res.json({err:err})
			if(actC) return res.json({msg:"¡Actividad registrada con éxito!", statusCode:0})
			
		})
	})
})

router.post("/save-edit-activity",(req,res)=>{
	var data = req.body

	models.activity.findOneAndUpdate(
		{stepActivity : data.stepActivityEdit, activityActivity : data.activityActivityEdit},
		{$set:{nameActivity:data.nameActivity, descriptionActivity:data.descriptionActivity, guidesActivity:data.guideActivity}
		},
		(err,doc) => {
			if(err) return res.json({err:err})
			if(doc) return res.json({msg:"¡Actividad actualizada con éxito!", statusCode:0})
			if(!doc) return res.json({msg:"¡Actividad no existe!", statusCode:2})
		})
})

router.post("/delete-activity",(req,res)=>{
	var data = req.body

	models.activity.findOne({stepActivity:data.stepActivityDel, activityActivity:data.activityActivityDel},(err,step) => {
		if(err) return res.json({err:err})
		if(step){
			models.activity.remove({stepActivity:data.stepActivityDel, activityActivity:data.activityActivityDel},(err) => {
				if(err) return res.json({err:err})
				return res.json({msg:"¡Actividad eliminada con éxito!", statusCode:0})
			})
		}else return res.json({msg:"¡Actividad no existe!",statusCode:2})
	})
})



//Exportar una variable de js mediante NodeJS
module.exports = router