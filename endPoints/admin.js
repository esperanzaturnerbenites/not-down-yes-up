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
		models.step.find({}, (err, steps) => {
			if(err) return res.json({err:err})
			if(!steps.length) return res.json({msg:"Not steps"})

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

function updateChildren(dataChildren,dataMom,dataDad,dataCare,req,res){


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

function createUser(dataUser,dataAdminuser,req,res){
	if(dataAdminuser.passUser == dataAdminuser.passConfirmUser){
		dataAdminuser.passUser = cryptr.encrypt(dataAdminuser.passUser)

		models.adminuser.findOne({userUser : dataAdminuser.userUser}, (err, adminFind) => {
			if(err) return res.json({err:err})
			if(adminFind) return res.json({err:{message:"¡Usuario de logueo ya existe!"}})
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
	}else return res.json({err:{message:"¡Contraseña no coincide!"}})
}

function updateUser(dataUser,req,res){
	delete dataUser.userUser
	delete dataUser.passUser

	models.user.update(
		{idUser : dataUser.idUser},
		{"$set": dataUser}
		,(err,status) => {
			if(err) return res.json({err:err})
			req.flash("success","¡Usuario actualizado con éxito!")
			return res.redirect("/admin/menu-admin")
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





	//return res.json(dataChildren)
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

router.post(["/register-user","/update-user"],upload.any(),(req,res)=>{
	var data = req.body,
		dataUser = data.user,
		dataAdminuser = data.adminuser

	dataAdminuser.untouchableUser = false

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
		dataUser.imgUser = fileUser ? fileUser.filename : defaultImage
		createUser(dataUser,dataAdminuser,req,res)
	}
})

router.get("/register-user/:id?",(req,res)=>{
	var id = req.params.id
	if(!id) return res.render("registerUserRol")

	models.user.findOne({idUser:id}).exec((err,userSearch) =>{
		if (err) return {err : err}
		return res.render("registerUserRol",{userEdit: userSearch})
	})
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
		if(!steps) return res.json({msg:"Not Steps",statusCode:CTE.STATUS_CODE.OK})
		if(steps){
			data.steps = steps

			models.activity.find({stepActivity:1},(err,activities)=>{
				if(err) return res.json({err:err})
				if(!activities) return res.json({msg:"Not Activities",statusCode:CTE.STATUS_CODE.OK})
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
	//res.json(data)

	models.children.findOne({idChildren:data.idChildren},function(err,children){
		models.step.findOne({stepStep:data.stepStep},function(err,step){
			console.log(step)
			models.stepvalid.findOne({idChildren:children._id,idStep:step._id},function(err,stepValid){
				
				data.idUser = req.user._id
				data.idChildren = children._id
				data.idStep = step._id

				if(stepValid){
					stepValid.update({$set:data},function(err,updateStepValid){
						res.json({message:"Validación Actualizada",type:CTE.STATUS_CODE.OK})
					})
				}else{
					models.stepvalid.create(data,function(err,newStepValid){
						children.update(
							{$set:{statusChildrenEstimulation:CTE.STATUS_ESTIMULATION.QUALIFIED}},
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