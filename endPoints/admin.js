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
	cryptr = new Cryptr(process.env.SECRET_KEY),
	CTE = require("../CTE"),
	jade = require("jade"),
	functions = require("./functions"),
	localsJade = {
		dataGeneral:{},
		parserCustom: functions.parserCustom,
		CTE: CTE
	}

router.use(bodyParser.urlencoded({extended:true}))
router.use(bodyParser.json())

router.get("/menu-admin",(req,res)=>{return res.render("menuAdmin")})
router.get("/admin-users",(req,res)=>{return res.render("adminUsers")})
router.get("/valid-step",(req,res)=>{return res.render("validStep")})
router.get("/backup",(req,res)=>{return res.render("backup")})

function createChildren(dataChildren,dataMom,dataDad,dataCare,req,res){
	if(dataMom.idParent == dataDad.idParent || dataChildren.idChildren == dataMom.idParent || dataChildren.idChildren == dataDad.idParent || dataChildren.idChildren == dataCare.idParent){
		req.flash("success","¡Números de identificación iguales")
		res.redirect(req.get("referer"))
	}else{

		var parents = [
			{idParent : dataMom,relationshipParent:0},
			{idParent : dataDad,relationshipParent:1},
			{idParent : dataCare,relationshipParent:2}
		]

		models.step.find({}, (err, steps) => {
			if(err) return res.json({err:err})
			if(!steps.length) return res.json({message:"No Hay Etapas Creadas",statusCode:CTE.STATUS_CODE.NOT_OK})

			var parentsChildren = []
			var promisesParent = []

			parents.forEach(oparent => {
				var promiseParent = new Promise(function(resolve,reject){
					models.parent.findOne({idParent : oparent.idParent.idParent},(err, parentFind) => {
						if(parentFind){
							parentsChildren.push({idParent:parentFind._id,relationshipParent:oparent.relationshipParent})
							resolve()
						}else{
							models.parent.create(oparent.idParent,(err, parentCreate) => {
								parentsChildren.push({idParent:parentCreate._id,relationshipParent:oparent.relationshipParent})
								resolve()
							})
						}
					})
				})
				promisesParent.push(promiseParent)
			})

			Q.all(promisesParent).then(function () {
				dataChildren.idParent = parentsChildren
				models.children.create(dataChildren, function (err, children) {
					if(err) return res.json({err:err})

					var promisesSteps = []
					for(var stepDB of steps){
						promisesSteps.push(models.stepvalid.create({idStep:stepDB._id, idUser:req.user._id, idChildren:children._id}))
					}

					Q.all(promisesSteps).then(function () {
						return res.redirect("/admin/menu-admin")
					})
				})
			})
		})
	}
}

function updateChildren(dataChildren,dataMom,dataDad,dataCare,req,res){

	models.children.findOneAndUpdate(
		{idChildren : dataChildren.currentIdChildren},
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
			req.flash("success","Niñ@ Actualizd@ Correctamente")
			return res.redirect("/admin/register-children/" + dataChildren.idChildren)
		})
	})
}

function createUser(dataUser,dataAdminuser,req,res){
	if(dataAdminuser.passUser == dataAdminuser.passConfirmUser){
		dataAdminuser.passUser = cryptr.encrypt(dataAdminuser.passUser)

		models.adminuser.findOne({userUser : dataAdminuser.userUser}, (err, adminFind) => {
			if(err) return res.json({err:err})
			if(adminFind) return res.json({err:{message:"¡Usuario de logueo ya existe!",statusCode:CTE.STATUS_CODE.INFORMATION}})
			if(!adminFind){
				models.user.create(dataUser, function (err, user) {
					if(err) return res.json({err:err})
					dataAdminuser.idUser = user._id
					dataAdminuser.statusUser = 1
					delete dataAdminuser.passConfirmUser
					
					models.adminuser.create(dataAdminuser, function (err, adminuser) {
						if(err) return res.json({err:err})
						return res.redirect("/admin/menu-admin")
					})
				})
			}
		})
	}else return res.json({err:{message:"¡Contraseña no coincide!",statusCode:CTE.STATUS_CODE.NOT}})
}

function updateUser(dataUser,req,res){
	delete dataUser.userUser
	delete dataUser.passUser

	models.user.update(
		{idUser : dataUser.currentIdUser},
		{"$set": dataUser}
		,(err,status) => {
			if(err) return res.json({err:err})
			req.flash("success","¡Usuario actualizado con éxito!")
			return res.redirect("/admin/register-user/" + dataUser.idUser)
		})
}

router.post(["/update-children","/register-children"],upload.any(),(req,res)=>{
	var data = req.body,
		dataChildren = data.children,
		dataMom = data.mom,
		dataDad = data.dad,
		dataCare = data.care

	var fileChildren =  req.files.find(e => {return e.fieldname == "children[imgChildren]"}),
		fileMom = req.files.find(e => {return e.fieldname == "mom[imgMom]"}),
		fileDad =  req.files.find(e => {return e.fieldname == "dad[imgDad]"}),
		fileCure =  req.files.find(e => {return e.fieldname == "care[imgCure]"})

	var defaultImage = "defaultUser.png",
		imgChildren =  fileChildren ? fileChildren.filename : defaultImage,
		imgMom =  fileMom ? fileMom.filename : defaultImage,
		imgDad =  fileDad ? fileDad.filename : defaultImage,
		imgCure =  fileCure ? fileCure.filename : defaultImage

	if(eval(data.editingChildren)){
		if(fileChildren){dataChildren.imgChildren = fileChildren.filename}
		else{delete dataChildren.imgChildren}

		if(fileMom){dataMom.imgParent = fileMom.filename}
		else{delete dataMom.imgParent}

		if(fileDad){dataDad.imgParent = fileDad.filename}
		else{delete dataDad.imgParent}

		if(fileCure){dataCare.imgParent = fileCure.filename}
		else{delete dataCare.imgParent}

		updateChildren(dataChildren,dataMom,dataDad,dataCare,req,res)
	}else{
		dataChildren.imgChildren =  imgChildren
		dataMom.imgParent =  imgMom
		dataDad.imgParent =  imgDad
		dataCare.imgParent =  imgCure
		createChildren(dataChildren,dataMom,dataDad,dataCare,req,res)
	}
})

router.get("/register-children/:id?",(req,res)=>{
	var id = req.params.id

	if(!id) return res.render("registerChildren")
		
	models.children.findOne({idChildren:id}).populate('idParent.idParent').exec((err,childrenSearch) =>{

		if (err) return {err : err}
		if (!childrenSearch) return res.json({message : "El niñ@ no Existe",statusCode:CTE.STATUS_CODE.NOT_OK})


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
				data.historys = acthisChild
				
				models.activityvalid.find({idChildren:childrenFind._id})
				.sort({date:-1})
				.populate("idStep idActivity idUser")
				.exec((err,actvalidChild) =>{
					if(err) return res.json({err:err})
					data.valids = actvalidChild
					
					models.stepvalid.find({idChildren:childrenFind._id})
					.sort({date:-1})
					.populate("idStep idUser")
					.exec((err,stepvalidChild) =>{
						if(err) return res.json({err:err})
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

router.post(["/register-user","/update-user"],upload.any(),(req,res)=>{
	var data = req.body,
		dataUser = data.user,
		dataAdminuser = data.adminuser


	var defaultImage = "defaultUser.png",
		fileUser =  req.files.find(e => {return e.fieldname == "user[imgUser]"})

	if(eval(data.editingUser)){
		if(fileUser){
			dataUser.imgUser = fileUser.filename
		}else{
			delete dataUser.imgUser
		}
		updateUser(dataUser,req,res)
	}else{
		dataAdminuser.untouchableUser = false
		dataUser.imgUser = fileUser ? fileUser.filename : defaultImage
		createUser(dataUser,dataAdminuser,req,res)
	}
})

router.get("/register-user/:id?",(req,res)=>{
	var id = req.params.id
	if(!id) return res.render("registerUserRol")

	models.user.findOne({idUser:id}).exec((err,userSearch) =>{
		if (err) return {err : err}
		if (!userSearch) return res.json({message : "El Usuario no Existe",statusCode:CTE.STATUS_CODE.NOT_OK})
		return res.render("registerUserRol",{userEdit: userSearch})
	})
})

router.get("/info-user/:id",(req,res)=>{
	var id = req.params.id,
		data = {}
	models.user.findOne({idUser:id}).exec((err,userFind) =>{
		if (err) return res.json({err:err})
		if (!userFind) return res.json({message : "El Usuario no Existe",statusCode:CTE.STATUS_CODE.NOT_OK})
		if(userFind){
			data.user = userFind
			models.adminuser.find({idUser:userFind._id},(err,adminU) =>{
				if(err) return res.json({err:err})
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

router.get("/admin-childrens",(req,res)=>{
	models.step.find({},(err,steps) => {
		if(err) return res.json({message:err})
		if(steps){
			return res.render("adminChildrens", {steps:steps})
		}
	})
})

router.get("/reports",(req,res)=>{
	var data = {}

	models.step.find({},(err,steps)=>{
		if(err) return res.json({err:err})
		if(steps){
			data.steps = steps

			models.activity.find({stepActivity:1},(err,activities)=>{
				if(err) return res.json({err:err})
				if(activities){
					data.activities = activities
					models.adminuser.find({typeUser:CTE.TYPE_USER.TEACHER, statusUser:CTE.STATUS_USER.ACTIVE})
					.populate("idUser")
					.exec(function(err,adminusers){
						if(err) return res.json({err:err})
						data.adminusers = adminusers
						res.render("report", {reportData:data})
					})
				}
			})
		}
	})
})

router.post("/valid-step",(req,res)=>{
	var data = req.body

	models.children.findOne({idChildren:data.idChildren},function(err,children){
		if(children.statusChildren != CTE.STATUS_USER.ACTIVE) return res.json({message:"El niñ@ esta inactivo",statusCode:CTE.STATUS_CODE.INFORMATION})

		models.step.findOne({stepStep:data.stepStep},function(err,step){
			models.stepvalid.findOne({idChildren:children._id,idStep:step._id},function(err,stepValid){
				
				data.idUser = req.user._id
				data.idChildren = children._id
				data.idStep = step._id

				if(stepValid){
					stepValid.update({$set:data},function(err,updateStepValid){
						models.stepvalid.count({idChildren:children._id,statusStep:{$ne:CTE.STATUS_ACTIVITY.UNVALIDATED}},function(err,numberStepsValid){
							models.step.count({},function(err,numberSteps){
								if(numberStepsValid != numberSteps) return res.json({message:"Validación Actualizada",statusCode:CTE.STATUS_CODE.OK})
								children.update(
									{$set:{statusChildrenEstimulation:CTE.STATUS_ESTIMULATION.QUALIFIED}},
									function(err,update){
										if(err) return res.json({message:"Validación Actualizada, No se Actualizo el estado del niñ@",statusCode:CTE.STATUS_CODE.OK})
										return res.json({message:"Validación Actualizada",statusCode:CTE.STATUS_CODE.OK})
									}
								)
							})
						})
					})
				}else{
					models.stepvalid.create(data,function(err,newStepValid){
						children.update(
							{$set:{statusChildrenEstimulation:CTE.STATUS_ESTIMULATION.IN_PROGRESS}},
							function(err,update){
								if(err) return res.json({message:"Validación Etapa Completada, No se Actualizo el estado del niñ@",type:CTE.STATUS_CODE.OK})
								return res.json({message:"Validación Etapa Completada",type:CTE.STATUS_CODE.OK})
							}
						)
					})
				}
			})
		})
	})
})

router.post("/pre-valid-step",(req,res)=>{
	var data = req.body,
		dataChildrens = [],
		filters = {
			steps:[parseInt(data.step)]
		}

	models.children.findOne({idChildren:data.idChildren},function(err,children){
		if(children.statusChildren != CTE.STATUS_USER.ACTIVE) return res.json({message:"El niñ@ esta inactivo",statusCode:CTE.STATUS_CODE.INFORMATION})

		children.getDataAll({
			filters:filters
		}).then(
			function(data){
				dataChildrens.push(data)
				localsJade.dataCustom = dataChildrens

				var fn = jade.compileFile("views/reports/consultAct.jade",{})
				var html = fn(localsJade)
				return res.json({html:html,localsJade:localsJade})
			},
			function(err){}
		)
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
	console.log("--------------------------")
	console.log(req.file.path)
	console.log("--------------------------")
	var file = fs.createReadStream("public/backups/b.tar")
	restore({
		uri: "mongodb://localhost/centerestimulation",
		stream: file,
		parser:"json",
		callback: function(err) {
			if(err) return res.json({err:err})
			return res.json({message:"Importación Correcta.",statusCode:CTE.STATUS_CODE.OK})
		}
	})
})

module.exports = router