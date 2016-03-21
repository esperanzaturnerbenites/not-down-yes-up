var express = require("express"),
	models = require('./../models'),
	mongoose = require("mongoose"),
	router = express.Router(),
	bodyParser = require('body-parser'),
	querystring = require('querystring'),
	ObjectId = mongoose.Types.ObjectId,
	multer = require('multer'),
	upload = multer({ dest: 'public/img/users' })

router.use(bodyParser.json())

router.get("/menu-admin",(req,res)=>{
	res.render("menuAdmin",{user :req.user})
})

router.post("/upload",upload.any(),(req,res)=>{
	res.json(req.files)
})

//Revisar Step Valid Add**********************************************************
router.post("/register-children/",upload.any(),(req,res)=>{
	dataChildren = querystring.parse(req.body.children),
	dataMom = querystring.parse(req.body.mom),
	dataDad = querystring.parse(req.body.dad),
	dataCare = querystring.parse(req.body.care)
	//console.log(dataChildren)
	dataChildren.birthdateChildren = new Date(dataChildren.birthdateChildren)
	dataMom.relationshipParent = 0
	dataDad.relationshipParent = 1
	dataCare.relationshipParent = 2

	models.children.create(dataChildren, function (err, children) {
		if(err) return res.json({err:err});
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
				//console.log(parentsFind.length)
				var aux = parentsFind.length ? "direfente de 0" : "igual a 0"
				//console.log(aux)
				//console.log(parentsFind)


				if(!parentsFind.length){
					models.parent.create([dataMom, dataDad, dataCare],(err, parentsCreate) => {
						if(err) return res.json({err:err})
						return res.json({msg : "create children and add parent"})
					})
				}else{
					models.parent.where({$or : queryParents})
					.setOptions({ multi: true })
					.update(
						{$push : {idChildren : children._id}},
						(err, parentDad) => {
							if(err) return res.json({err:err})
							res.json({msg : "create children and update parent"})
					})
				}
			})
			//Revisar Step Valid Add**********************************************************
			models.step.find({}, (err, steps) => {
				if(err) return res.json({err:err})
				if(!steps) return res.json({msg:"Not steps"})

				for(step of steps){
					models.stepvalid.crate({idStep:step._id, idUser:req.user._id, idChildren:children._id}, (err, stepValid) => {
						if(err) return res.json({err:err})
						if(stepValid) return res.json({msg:"Step valid add"})
					})
					
				}
				
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
	data = req.body

	models.children.findOne({idChildren : data.validChildren},(err,exists) => {
		if(err) return res.json({err:err});
		if(exists) res.json({valid:false, msg:"Children exists",statusCode:0})
		else res.json({valid:true, msg:"",statusCode:1})
	})
})

router.all("/register-user",(req,res)=>{
	if(req.method == "GET"){	
		res.render("registerUserRol")
	}else if(req.method == "POST"){
		dataUser = querystring.parse(req.body.userAdd),
		dataUserAdmin = querystring.parse(req.body.userAdmin)
		
		//console.dir(dataUser.idUser)

		models.user.create(dataUser, function (err, user) {
			if(err) return res.json({err:err});
			dataUserAdmin.idUser = user._id

			models.adminuser.create(dataUserAdmin, function (err, adminuser) {
				if(err) return res.json({err:err});
				return res.json({message:"User Add Complete"})
			})
		})
	}
})

router.post("/valid-user",(req,res)=>{
	data = req.body

	models.user.findOne({idUser : data.validUser},(err,exists) => {
		if(err) return res.json({err:err});
		if(exists){
			 res.json({valid:false, msg:"User exists",statusCode:0});
		}else{
			 res.json({valid:true, msg:"",statusCode:1});
		}
	})
})

router.post("/register-newuser",(req,res)=>{
	data = req.body

	console.dir(data)

	if(data.passUser == data.newPassConfirmUser){
		models.user.findOne({idUser : data.idUser},(err,user) => {
			if(err) return res.json({err:err})

			if(!user) return res.json({msg:"User not Found"});
			data.idUser = user._id
			models.adminuser.create(data, function (err, adminuser) {
				if(err) return res.json({err:err});
				return res.json({message:"Useradmin Add Complete"})
			})
		})
	}else return res.json({msg:"Password not equals"});
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
		.populate('idUser')
		.exec((err,users) =>{
			res.json(users)
		})
	}else{
		models.adminuser.find({typeUser : data.typeUser})
		.populate('idUser')
		.exec((err,users) =>{
			res.json(users)
		})
	}
})

router.post("/update-pass",(req,res)=>{
	data = req.body
	
	if(data.adminIdUser == "Developer"){
		return res.json({msg:"User not Password Update"})
	}else{
		models.adminuser.findOneAndUpdate(
			{userUser : data.adminIdUser},
			{$set:{passUser:data.adminPassUser}},
			(err,doc) => {
	  			if(err) return res.json({err:err});
			  	return res.json({message:"Password Chage Complete", adminuser : doc})
		})
	}
})

//Delete children --- Metodo Agregate **********************************************
router.post("/delete-childrens",(req,res)=>{
	data = req.body

	models.children.findOne({idChildren : data.adminOpeChildren},(err,children) => {
		if(err) return res.json({err:err});
		if(children){
			models.children.remove({idChildren : data.adminOpeChildren},(err) => {
				if(err) return res.json({err:err});
				models.parent.find({idChildren : {$in : children.idChildren}})
				models.parent.remove({idChildren : children.idChildren},(err) => {
					if(err) return res.json({err:err});
					return res.json({msg:"Children Delete Complete"})
				})
			})
		}else{
			return res.json({msg:"Children not Found"});
		}
	})
})

router.post("/delete-users",(req,res)=>{
	data = req.body

	if(data.adminOpeIdUser == "developer"){
		return res.json({msg:"User not Delete"})
	}else{
		models.adminuser.findOne({userUser:data.adminOpeIdUser, _id:{$ne : req.user._id}},(err,userD) => {
			if(err) return res.json({err:res})
			if(userD){
				models.adminuser.remove({userUser:data.adminOpeIdUser},(err) => {
					if(err) return res.json({err:err});
					return res.json({msg:"User Delete Complete"})
				})
			}else return res.json({msg:"User not Found"});
		})
	}
})

router.post("/delete-teachadmin",(req,res)=>{
	data = req.body

	models.user.findOne({idUser : data.adminOpeTeachAdmin},(err,user) => {
		if(err) return res.json({err:err});
		if(user){

			models.user.remove({idUser : data.adminOpeTeachAdmin},(err) => {
				if(err) return res.json({err:err})

				models.adminuser.remove({idUser : user._id},(err) => {
					if(err) return res.json({err:err});
					return res.json({msg:"User(TeachAdmin) Delete Complete"})
				})
			})
		}else return res.json({msg:"User(TeachAdmin) not Found"});
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
			.populate('idActivity idUser idChildren')
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
				if(err) return res.json({err:err});
				if(stephis) return res.json({msg : "Step valid exists"})

				models.stepvalid.create(data, function (err, step) {
					if(err) return res.json({err:err});
					if(step) return res.json({msg : "Step Valid Complete"})
				})
			})
		})
	})
})

router.post("/update-teachAdmin",(req,res)=>{
	data = req.body

	models.user.findOne({idUser : data.adminOpeTeachAdmin},(err,exists) => {
		if(err) return res.json({err:err});
		if(exists){
			res.json({valid:true, msg:"",statusCode:1});
		}else{
			res.json({valid:false, msg:"User not found",statusCode:0});
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