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

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended:true}))


router.get("/menu-admin",(req,res)=>{
	res.render("menuAdmin",{user :req.user})
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

router.post("/register-children",upload.any(),(req,res)=>{
	console.log("init")
	var data = req.body,
		dataChildren = {
			abilityChildren : data.abilityChildren,
			addressChildren : data.addressChildren,
			ageChildren : data.ageChildren,
			apbChildren : data.apbChildren,
			birthdateChildren : new Date(data.birthdateChildren),
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
			imgChildren : req.files[0].filename,
			lastnameChildren : data.lastnameChildren,
			levelhomeChildren : data.levelhomeChildren,
			liveSon : data.liveSon,
			localityChildren : data.localityChildren,
			municipalityChildren : data.municipalityChildren,
			nameChildren : data.nameChildren
		},
		dataMom = {
			celParent : data.celParent[0],
			emailParent : data.emailParent[0],
			idExpeditionParent : data.idExpeditionParent[0],
			idParent : data.idParent[0],
			imgParent : req.files[1].filename,
			jobParent : data.jobParent[0],
			lastnameParent : data.lastnameParent[0],
			nameParent : data.nameParent[0],
			professionParent : data.professionParent[0],
			relationshipParent : 0,
			studyParent : data.studyParent[0],
			telParent : data.telParent[0]
		},
		dataDad = {
			celParent : data.celParent[1],
			emailParent : data.emailParent[1],
			idExpeditionParent : data.idExpeditionParent[1],
			idParent : data.idParent[1],
			imgParent : req.files[2].filename,
			jobParent : data.jobParent[1],
			lastnameParent : data.lastnameParent[1],
			nameParent : data.nameParent[1],
			professionParent : data.professionParent[1],
			relationshipParent : 1,
			studyParent : data.studyParent[1],
			telParent : data.telParent[1]
		},
		dataCare = {
			celParent : data.celParent[2],
			emailParent : data.emailParent[2],
			idExpeditionParent : data.idExpeditionParent[2],
			idParent : data.idParent[2],
			imgParent : req.files[3].filename,
			lastnameParent : data.lastnameParent[2],
			nameParent : data.nameParent[2],
			relationshipParent : 2,
			telParent : data.telParent[2]
		},
		promises = []

	models.children.create(dataChildren, function (err, children) {
		if(err) return res.json({err:err})
		if(children){

			var queryParents = [
					{idParent : dataMom.idParent},
					{idParent : dataDad.idParent},
					{idParent : dataCare.idParent}
			]

			dataMom.idChildren = children._id
			dataDad.idChildren = children._id
			dataCare.idChildren = children._id

			models.parent.find(
				{$or : queryParents},
				function (err, parentsFind) {
					if(err) return res.json({err:err})

					models.step.find({}, (err, steps) => {
						if(err) return res.json({err:err})
						if(!steps.length) return res.json({msg:"Not steps"})

						for(var step in steps){
							promises.push(models.stepvalid.create({idStep:step._id, idUser:req.user._id, idChildren:children._id}))
						}
						Q.all(promises).then(function (result) {
							if(!parentsFind.length){
								models.parent.create([dataMom, dataDad, dataCare],(err, parentsCreate) => {
									if(err) return res.json({err:err})
									res.redirect("/admin/menu-admin")
								})
							}else{
								models.parent.where({$or : queryParents})
								.setOptions({ multi: true })
								.update(
									{$push : {idChildren : children._id}},
									(err, parentDad) => {
										if(err) return res.json({err:err})
										res.redirect("/admin/menu-admin")
									})
							}
						})
					})


				})
		}else return res.json({msg:"Children not found"})
	})
})

router.get("/register-children/:id?",(req,res)=>{
	var context = {}
	if(req.params.id){
		var id = req.params.id
		context = models.children.findOne({idChildren:id}).lean()
		console.log(context)
	}
	res.render("registerChildren",context)	
})

router.post("/valid-children",(req,res)=>{
	var data = req.body

	models.children.findOne({idChildren : data.validChildren},(err,exists) => {
		if(err) return res.json({err:err})
		if(exists) res.json({valid:false, msg:"¡Niñ@ ya existe!", statusCode:2})
		else res.json({valid:true, msg:"", statusCode:1})
	})
})

router.all("/register-user",(req,res)=>{
	if(req.method == "GET"){
		res.render("registerUserRol")
	}else if(req.method == "POST"){
		var dataUser = querystring.parse(req.body.userAdd),
			dataUserAdmin = querystring.parse(req.body.userAdmin)
			
		if(dataUserAdmin.passUser == dataUserAdmin.passConfirmUser){

			models.adminuser.findOne({userUser : dataUserAdmin.userUser}, (err, adminFind) => {
				if(err) return res.json({err:err})
				if(adminFind) return res.json({err:{message:"¡Usuario de logüeo ya existe!"}})
				if(!adminFind){
					models.user.create(dataUser, function (err, user) {
						if(err) return res.json({err:err})
						dataUserAdmin.idUser = user._id
						delete dataUserAdmin.passConfirmUser
						console.log(dataUserAdmin)
						
						models.adminuser.create(dataUserAdmin, function (err, adminuser) {
							if(err) return res.json({err:err})
							return res.json({msg:"¡Usuario registrado con éxito!", statusCode : 0})
						})
					})
				}
			})
		}else return res.json({err:{message:"¡Contraseña no coincide!"}})
	}
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
			if(adminFind) return res.json({err:{message:"¡Usuario de logüeo ya existe!"}})
			if(!adminFind){

				models.user.findOne({idUser : data.idUser},(err,user) => {
					if(err) return res.json({err:err})
					if(!user) return res.json({err:{message:"¡Usuario no existe!"}})
					if(user){
						data.idUser = user._id
						models.adminuser.create(data, function (err, adminuser) {
							if(err) return res.json({err:err})
							if(adminuser) return res.json({msg:"¡Usuario de logüeo registrado con éxito!", statusCode : 0})
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
			res.json(users)
		})
	}else{
		models.adminuser.find({typeUser : data.typeUser})
		.populate("idUser")
		.exec((err,users) =>{
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
				if(!doc) return res.json({err:{message:"¡Usuario de logüeo no existe!"}})
			})
	}
})

//Delete children --- Metodo Agregate **********************************************
router.post("/delete-childrens",(req,res)=>{
	data = req.body

	models.children.findOne({idChildren : data.adminOpeChildren},(err,children) => {
		if(err) return res.json({err:err})
		if(children){
			models.children.remove({idChildren : data.adminOpeChildren},(err) => {
				if(err) return res.json({err:err})
				models.parent.find({idChildren : {$in : children.idChildren}})
				models.parent.remove({idChildren : children.idChildren},(err) => {
					if(err) return res.json({err:err})
					return res.json({msg:"Children Delete Complete"})
				})
			})
		}else{
			return res.json({msg:"Children not Found"})
		}
	})
})

router.post("/delete-users",(req,res)=>{
	var data = req.body

	if(data.adminOpeIdUser == "Developer"){
		return res.json({err:{message:"¡Usuario no puede ser eliminado"}})
	}else{
		models.adminuser.findOne({userUser:data.adminOpeIdUser, _id:{$ne : req.user._id}},(err,userD) => {
			if(err) return res.json({err:res})
			if(userD){
				models.adminuser.remove({userUser:data.adminOpeIdUser},(err) => {
					if(err) return res.json({err:err})
					return res.json({msg:"¡Usuario eiminado con éxito!", statusCode:0})
				})
			}else return res.json({err:{message:"¡Usuario no existe!"}})
		})
	}
})

router.post("/delete-teachadmin",(req,res)=>{
	var data = req.body

	models.user.findOne({idUser : data.adminOpeTeachAdmin},(err,user) => {
		if(err) return res.json({err:err})
		if(user){
			models.user.remove({idUser : data.adminOpeTeachAdmin},(err) => {
				if(err) return res.json({err:err})

				models.adminuser.remove({idUser : user._id},(err) => {
					if(err) return res.json({err:err})
					return res.json({msg:"¡Usuario eliminado con éxito!", statusCode:0})
				})
			})
		}else return res.json({err:{message:"¡Usuario no existe!"}})
	})
})

//Si borro el usuario Aqui aparece como null
router.post("/show-valid-step",(req,res)=>{
	var data = req.body

	models.children.findOne({idChildren : data.idChildren}, (err,children) => {
		if(err) return res.json({err:err})
		if(!children) return res.json({msg:"Children not found"})

		models.step.findOne({stepStep : data.step}, (err,stepFind) => {
			if(err) return res.json({err:err})
			if(!stepFind) return res.json({msg:"Step not found"})

			models.activityvalid.find({idChildren : children._id, idStep : stepFind._id})
			.populate("idActivity idUser idChildren")
			.exec((err, activitiesvalid) => {
				if (err) return res.json({err: err})
				return res.json({msg:"Activities found", activitiesvalid:activitiesvalid, children:children, step:stepFind})
			})
		})
	})
})

router.post("/valid-step",(req,res)=>{
	data = req.body
	data.idUser = req.user._id
	console.log(data)

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
				if(stephis) return res.json({msg : "Step valid exists"})

				models.stepvalid.create(data, function (err, step) {
					if(err) return res.json({err:err})
					if(step) return res.json({msg : "Step Valid Complete"})
				})
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
	res.render("report")
})

router.get("/backup",(req,res)=>{
	res.render("backup")
})

//Exportar una variable de js mediante NodeJS
module.exports = router