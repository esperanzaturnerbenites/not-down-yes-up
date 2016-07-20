var express = require("express"),
	models = require("./../models"),
	router = express.Router(),
	bodyParser = require("body-parser"),
	multer = require("multer"),
	upload = multer({ dest: "public/img/users" }),
	uploadBackup = multer({ dest: "public/backups/" }),
	Q = require("q"),
	backup = require("mongodb-backup"),
	restore = require("mongodb-restore"),
	fs = require("fs"),
	Cryptr = require("cryptr"),
	cryptr = new Cryptr(process.env.SECRETKEY),
	CTE = require("../CTE")

router.use(bodyParser.urlencoded({extended:true}))
router.use(bodyParser.json())

function filter(body,files){
	if (files){
		files.forEach(file => {
			body[file.fieldname] = file.filename
		})
	}
	return body
}

router.get("/menu-admin",(req,res)=>{return res.render("menuAdmin")})
router.get("/admin-users",(req,res)=>{return res.render("adminUsers")})
router.get("/valid-step",(req,res)=>{return res.render("validStep")})
router.get("/backup",(req,res)=>{return res.render("backup")})

/*
	Valida que un id(Identificacion) no se encuentre Registrada
	Request Data {String} id: id a Validar
	Response {Object}: Resultado de la validacion
		@property {String} msg: Menaje de Validacion
		@property {Number} statusCode: Estado de la Validacion
*/
router.post("/id-exists",(req,res)=>{
	var message = {msg:"Esta Identificacion ya se encuenta Registrada",statusCode:CTE.STATUS_CODE.INFORMATION}

	models.user.findOne({idUser : req.body.id}, (err, user) => {
		if(user) return res.json(message)
		models.parent.findOne({idParent : req.body.id}, (err, parent) => {
			if(parent) return res.json(message)
			models.children.findOne({idChildren : req.body.id}, (err, children) => {
				if(children) return res.json(message)
				return res.json({msg:"Ok",statusCode:CTE.STATUS_CODE.OK})
			})
		})
	})
})

/* OK */
var createChildren =  (dataChildren,dataMom,dataDad,dataCare,req,res) => {
	var promises = []
	if(dataMom.idParent == dataDad.idParent || dataMom.idParent == dataCare.idParent || dataDad.idParent == dataCare.idParent || dataChildren.idChildren == dataMom.idParent || dataChildren.idChildren == dataDad.idParent || dataChildren.idChildren == dataCare.idParent){
		req.flash("success","¡Números de identificación iguales")
		res.redirect(req.get("referer"))
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

/* OK */
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

/* OK */
router.post(["/update-children","/register-children"],upload.any(),(req,res)=>{

	var fileChildren =  req.files.find(e => {return e.fieldname == "imgChildren"}),
		fileMom = req.files.find(e => {return e.fieldname == "imgMom"}),
		fileDad =  req.files.find(e => {return e.fieldname == "imgDad"}),
		fileCure =  req.files.find(e => {return e.fieldname == "imgCure"})

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

/* OK */
router.get("/register-children/:id?",(req,res)=>{
	var id = req.params.id

	if(!id) return res.render("registerChildren")
		
	models.children.findOne({idChildren:id}).populate('idParent.idParent').exec((err,childrenSearch) =>{
		if (err) return {err : err}


		var mom = childrenSearch.idParent.find(parent => {return parent.relationshipParent == 0}),
			dad = childrenSearch.idParent.find(parent => {return parent.relationshipParent == 1}),
			cure = childrenSearch.idParent.find(parent => {return parent.relationshipParent == 2})

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

/* OK */
router.get("/info-children/:id",(req,res)=>{
	var id = req.params.id,
		data = {}

	models.children.findOne({idChildren:id})
	.populate("idParent.idParent")
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

router.get("/register-user/:id?",(req,res)=>{
	var id = req.params.id
	if(!id) return res.render("registerUserRol")

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
			passUser :cryptr.encrypt(req.body.passUser),
			passConfirmUser :cryptr.encrypt(req.body.passConfirmUser)
		}

	var fileUser =  req.files.find(e => {return e.fieldname == "imgUser"})

	var defaultImage = "defaultUser.png"
	dataUser.imgUser = fileUser ? fileUser.filename : defaultImage

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
					
					models.adminuser.create(dataUserAdmin, function (err, adminuser) {
						if(err) return res.json({err:err})
						return res.redirect("/admin/menu-admin")
					})
				})
			}
		})
	}else return res.json({err:{message:"¡Contraseña no coincide!"}})
})

router.get("/admin-childrens",(req,res)=>{
	models.step.find({},(err,steps) => {
		if(err) return res.json({message:err})
		if(steps){
			return res.render("adminChildrens", {steps:steps})
		}
	})
})

router.post("/update-user",upload.any(),(req,res)=>{
	
	var dataUser = filter(req.body)

	models.user.update(
		{idUser : dataUser.idUser},
		{"$set": dataUser}
		,(err,status) => {
			if(err) return res.json({err:err})
			req.flash("success","¡Usuario actualizado con éxito!")
			return res.redirect("/admin/menu-admin")
		})
})

/* OK */
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
			})
		}
	})
})

/* OK */
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

router.post("/valid-step",(req,res)=>{
	var data = req.body

	data.idUser = req.user._id


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
						{$set:{statusChildrenEstimulation:2}},
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

router.post("/backup",(req,res)=>{
	res.writeHead(200, {"Content-Type": "application/x-tar"})
	backup({
		uri: "mongodb://localhost/centerestimulation",
		tar:"backup.tar",
		stream: res,
		parser:"json"
	})
})

router.post("/restore",uploadBackup.single("data"),(req,res)=>{
	var file = fs.createReadStream(req.file.path)
	restore({
		uri: "mongodb://localhost/centerestimulation", // mongodb://<dbuser>:<dbpassword>@<dbdomain>.mongolab.com:<dbport>/<dbdatabase>
		stream: file, // send this stream into db
		callback: function(err) { // callback after restore
			if(err) return res.json({err:err})
			return res.json({msg:"importacion correcta"})
			
		}
	})
})

//Exportar una variable de js mediante NodeJS
module.exports = router