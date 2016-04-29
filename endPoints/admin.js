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
router.get("/register-children",(req,res)=>{
	res.render("registerChildren")
})
	
var createChildren =  (dataChildren,dataMom,dataDad,dataCare,req,res) => {
	console.log("create")
	var promises = []
	if(dataMom.idParent == dataDad.idParent || dataMom.idParent == dataCare.idParent || dataDad.idParent == dataCare.idParent || dataChildren.idChildren == dataMom.idParent || dataChildren.idChildren == dataDad.idParent || dataChildren.idChildren == dataCare.idParent){
		return res.json({err:{message : "¡Números de identificación iguales"}})
	}else{
	console.log("bien")
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

				var arrayParents = [dataMom, dataDad, dataCare]

				models.parent.find(
					{$or : queryParents},
					function (err, parentsFind) {
							console.log(!parentsFind.length)
						if(err) return res.json({err:err})

						models.step.find({}, (err, steps) => {
							if(err) return res.json({err:err})
							if(!steps.length) return res.json({msg:"Not steps"})

							for(var stepDB of steps){
								console.log(stepDB)
								promises.push(models.stepvalid.create({idStep:stepDB._id, idUser:req.user._id, idChildren:children._id}))
							}
							Q.all(promises).then(function (result) {
								if(!parentsFind.length){
									models.parent.create(arrayParents,(err, parentsCreate) => {
										if(err) return res.json({err:err})
										res.redirect("/admin/menu-admin")
									})
								}else{
										
									var relation = parentsFind.map(parent => {parent.relationshipParent})

									var parentsNoExist = arrayParents.filter(parent => {
										if(relation.indexOf(parent.relationshipParent) < 0){
											return parent
										}
									models.parent.where({$or : queryParents})
									.setOptions({ multi: true })
									.update(
										{
											$push : {
												idChildren : children._id,
												relationshipParent : parent.relationshipParent
											}
										},
										(err, parentDad) => {
											if(err) return res.json({err:err})
											if(parentsNoExist.length){
												models.parent.create(parentsNoExist,(err, parentsCreate) => {
													if(err) return res.json({err:err})
													res.redirect("/admin/menu-admin")
												})
											}else{
												res.redirect("/admin/menu-admin")
											}



										})

									})
									console.log(parentsNoExist)
								}
							}).catch(err => {
								console.log(err)
							})
						})


					})
			}else return res.json({msg:"Children not found"})
		})
	}
}

var updateChildren =  (dataChildren,dataMom,dataDad,dataCare,req,res) => {
	models.children.findOneAndUpdate(
		{idChildren : dataChildren.idChildren},
		{"$set": dataChildren},
	(err,children) => {
		if(err) return res.json({err:err})

		models.parent.update(
			{"$and" :[{idChildren : {$in : [children._id]},relationshipParent : 0}]},
			{"$set": dataMom}
		).exec(err => {
			if(err) return res.json({err:err})
			models.parent.update(
				{"$and" :[{idChildren : {$in : [children._id]},relationshipParent : 1}]},
				{"$set": dataDad}
			).exec(err => {
				if(err) return res.json({err:err})
				models.parent.update(
					{"$and" :[{idChildren : {$in : [children._id]},relationshipParent : 2}]},
					{"$set": dataCare}
				).exec(err => {
					if(err) return res.json({err:err})
					return res.json({msg:"niño actualizado con éxito!", statusCode : 0})
				})
			})
		})
	})
}

router.post(["/update-children","/register-children"],(req,res)=>{
	//console.log("init")
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
			//imgChildren : req.files[0].filename,
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
			//imgParent : req.files[1].filename,
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
			//imgParent : req.files[2].filename,
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
			//imgParent : req.files[3].filename,
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

router.get("/register-children/:id",(req,res)=>{
	var id = req.params.id
	models.children.findOne({idChildren:id}).exec((err,childrenSearch) =>{
		if (err) return {err : err}
		models.parent.find(
			{idChildren : {"$in" : [childrenSearch._id]}},
			(err, parents) => {
				var mom = parents.find(parent => {return parent.relationshipParent == 0}),
					dad = parents.find(parent => {return parent.relationshipParent == 1}),
					cure = parents.find(parent => {return parent.relationshipParent == 2})
				res.render("registerChildren",
					{
						data: {
							children : childrenSearch,
							parents : {
								mom : mom,
								dad : dad,
								cure : cure
							}
						}
					}
				)
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

router.all("/register-user",(req,res)=>{
	if(req.method == "GET"){
		res.render("registerUserRol")
	}else if(req.method == "POST"){
		var dataUser = querystring.parse(req.body.userAdd),
			dataUserAdmin = querystring.parse(req.body.userAdmin)
			
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
							return res.json({msg:"¡Usuario registrado con éxito!", statusCode : 0})
						})
					})
				}
			})
		}else return res.json({err:{message:"¡Contraseña no coincide!"}})
	}
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
				
				models.activityhistory.find({idUser:userFind._id})
				.populate("idChildren idActivity")
				.sort({idChildren:1})
				.exec((err,hisact) =>{
					if(err) return res.json({err:err})
					if(!hisact) return res.json({err:{message:"No tiene actividades"}})
					if(hisact){
						data.children = hisact
						res.render("infoUserRol",{infoUser: data})
					}
				})

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

router.get("/register-user/:id",(req,res)=>{
	var id = req.params.id
	models.user.findOne({idUser:id}).exec((err,userSearch) =>{
		if (err) return {err : err}
		res.render("registerUserRol",{data: userSearch})
	})
})

router.post("/update-user",(req,res)=>{
	
	var dataUser = querystring.parse(req.body.userAdd)

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
			if(adminFind) return res.json({err:{message:"¡Usuario de logüeo ya existe!"}})
			if(!adminFind){

				models.user.findOne({idUser : data.idUser},(err,user) => {
					if(err) return res.json({err:err})
					if(!user) return res.json({msg:"¡Usuario no existe!", statusCode:2})
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

router.get("/info-children/:id",(req,res)=>{
	var id = req.params.id,
		data = {}
	//console.log(id)
	models.children.findOne({idChildren:id},(err,childrenFind) =>{
		if (err) return res.json({err:err})
		if (!childrenFind) return res.json({err:{message:"Children not exist"}})
		if(childrenFind){
			data.child = childrenFind

			models.parent.find({idChildren:childrenFind._id})
			.sort({relationshipParent:1})
			.exec((err,parentsFind)=>{
				if(err) return res.json({err:err})
				if(!parentsFind) return res.json({err:{message:"Not parents"}})
				if(parentsFind){
					data.parents = parentsFind
				}
				models.activityhistory.find({idChildren:childrenFind._id})
				.sort({date:-1})
				.populate("idActivity idUser idStep")
				.exec((err,acthisChild) =>{
					if(err) return res.json({err:err})
					if(!acthisChild) return res.json({msg:"No tiene actividades - History"})
					data.historys = acthisChild
					
					models.activityvalid.find({idChildren:childrenFind._id})
					.sort({date:-1})
					.populate("idActivity idUser idStep")
					.exec((err,actvalidChild) =>{
						if(err) return res.json({err:err})
						if(!actvalidChild) return res.json({err:{message:"No tiene actividades - Valid"}})
						if(actvalidChild){data.valids = actvalidChild}
						
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
				if(!doc) return res.json({msg:"¡Usuario de logüeo no existe!", statusCode:2})
			})
	}
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
			models.children.remove({idChildren : data.adminOpeChildren},(err) => {
				if(err) return res.json({err:err})
				models.parent.find(
					{idChildren : {$in : [children._id]}},
					(err, parents) => {
						if (err) return res.json({err:err})
						var promises = []
						parents.forEach(parent => {
							if(parent.idChildren.length == 1){
								promises.push(models.parent.remove({idParent: parent.idParent}))
							}else{
								promises.push(models.parent.where({idParent: parent.idParent})
									.setOptions({ multi: true })
									.update(
										{$pull: {idChildren: children._id } }
								))
							}
						})
						Q.all(promises).then(function () {
							return res.json({msg:"¡Niñ@ eliminado con éxito!", statusCode : 2})
						})
					})
			})
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
					console.log("typeUser" + admin.typeUser)

					models.activityhistory.find({idUser:admin._id},(err,acthisFind) => {
						if(err) return res.json({err:err})
						if(acthisFind){
							userhis.push(admin._id)
							console.log("id adminuser" + admin._id)
						}
					})
				}
				console.log("userhis" + userhis.length)
				console.log("userteach|" + userteach)

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

//Si borro el usuario Aqui aparece como null
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
					{"$set": 	data},
					(err,doc) => {
						if(err) return res.json({err:err})
						if(doc) return res.json({msg:"¡Validación Semestral de Etapa Exitosa!", statusCode:0, activity:doc})
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

			models.activity.find({},(err,activities)=>{
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

//Exportar una variable de js mediante NodeJS
module.exports = router