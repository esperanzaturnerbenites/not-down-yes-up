var express = require("express"),
models = require('./../models'),
mongoose = require("mongoose"),
router = express.Router(),
bodyParser = require('body-parser'),
querystring = require('querystring'),
ObjectId = mongoose.Types.ObjectId

router.use(bodyParser.urlencoded())

router.get("/menu-admin",(req,res)=>{
	res.render("menuAdmin",{user :req.user})
})

router.post("/register-children/",(req,res)=>{
	dataChildren = querystring.parse(req.body.children),
	dataMom = querystring.parse(req.body.mom),
	dataDad = querystring.parse(req.body.dad),
	dataCare = querystring.parse(req.body.care)
	console.log(dataChildren)
	dataChildren.birthdateChildren = new Date(dataChildren.birthdateChildren)

	/*dataChildren.idMom = dataMom.idMom
	dataChildren.idDad = dataDad.idDad
	dataChildren.idCare = dataCare.idCare*/
	models.children.findOne({idChildren:dataChildren.idChildren},(err,exists) =>{
		if(err) return res.send(err);
		if(exists){
			return res.json({msg:"Children Replay"});
		}else{
			models.children.create(dataChildren, function (err, children) {
		  		if (err) return res.send(err);
		  		dataMom.idChildren = children._id
				dataDad.idChildren = children._id
				dataCare.idChildren = children._id
	  			models.mom.create(dataMom, function (err, mom){
	  				if (err) return res.send(err);
	  				models.dad.create (dataDad, function (err, dad){
	  					if (err) return res.send(err);
	  					models.care.create(dataCare, function (err, care){
	  						if (err) return res.send(err);
	  						return res.json({message:"Children Add Complete", children : children})
	  					})
	  				})
	  			})
			})
		}
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
  		if (err) return res.send(err);
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
		models.user.findOne({idUser : dataUser.idUser},(err,exists) => {
	  		if (err) return res.send(err);
	  		if(exists){
	  			return res.json({msg:"User Replay"});
	  		}else{
	  			models.adminuser.findOne({userUser : dataUserAdmin.userUser},(err,existsa) => {
	  				if (err) return res.send(err);
	  				if(existsa){
	  					return res.json({msg:"UserAdmin Replay"});
	  				}else{
				  		models.user.create(dataUser, function (err, user) {
				  			if (err) return res.send(err);
				  			dataUserAdmin.idUser = user._id
							models.adminuser.create(dataUserAdmin, function (err, adminuser) {
						  		if (err) return res.send(err);
						  		return res.json({message:"User Add Complete"})
							})
						})
	  				}
	  			})
  			}
		})
	}
})

router.post("/valid-user",(req,res)=>{
	data = req.body

	models.user.findOne({idUser : data.validUser},(err,exists) => {
  		if (err) return res.send(err);
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
			if (err) return res.send(err);
			if(user){
				models.adminuser.findOne({userUser : data.userUser},(err,existsa) => {
					if (err) return res.send(err);
					if(existsa){
						return res.json({msg:"Useradmin Replay"});
					}else{
						data.idUser = user._id
						models.adminuser.create(data, function (err, adminuser) {
					  		if (err) return res.send(err);
					  		return res.json({message:"Useradmin Add Complete"})
						})
					}
				})
			}else{
				return res.json({msg:"User not Found"});
			}
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
		models.adminuser.find({typeUser : {$ne : "2"}}, (err,users) =>{
			models.user.find({idUser: users._id}, (err,usersU) =>{
				if (err) return res.send(err)
				users.userUser = usersU.userUser
				res.json(users)	
				
			})
		})
	}else{
		models.adminuser.find({typeUser : data.typeUser}, (err,users) =>{
			models.user.find({idUser: users._id}, (err,usersU) =>{
				if (err) return res.send(err)
				users.userUser = usersU.userUser
				res.json(users)	
			})
		})
	}
})

router.post("/update-pass",(req,res)=>{
	data = req.body
	
	if (data.adminIdUser == "admin"){
		return res.send({msg:"User not Password Update"})
	}else{
		models.adminuser.findOneAndUpdate(
			{userUser : data.adminIdUser},
			{$set:{passUser:data.adminPassUser}},
			(err,doc) => {
	  			if (err) return res.send(err);
			  	return res.json({message:"Password Chage Complete", adminuser : doc})
		})
	}
})

router.post("/delete-childrens",(req,res)=>{
	data = req.body

	var child = models.children.findOne({idChildren : data.adminOpeChildren})

	models.children.findOne({idChildren : data.adminOpeChildren},(err,children) => {
  		if (err) return res.send(err);
  		if(children){
			models.children.remove({idChildren : data.adminOpeChildren},(err) => {
			  	if (err) return res.send(err);
			  	models.mom.remove({idChildren : children._id},(err) => {
				  	if (err) return res.send(err);
				  	models.dad.remove({idChildren : children._id},(err) => {
					  	if (err) return res.send(err);
					  	models.care.remove({idChildren : children._id},(err) => {
						  	if (err) return res.send(err);
			  				return res.send({msg:"Children Delete Complete"})
						})	
					})	
				})	
			})
		}else{
  			return res.json({msg:"Children not Found"});
  		}
	})
})

router.post("/delete-users",(req,res)=>{
	data = req.body

	if (data.adminOpeIdUser == "developer"){
		return res.send({msg:"User not Delete"})
	}else{
		models.adminuser.findOne({userUser : data.adminOpeIdUser, _id :{$ne : req.user._id}},(err,userD) => {
	  		if (err) return res.send(err)
	  		if(userD){
				models.adminuser.remove({userUser : data.adminOpeIdUser},(err) => {
				  	if (err) return res.send(err);
				  	return res.send({msg:"User Delete Complete"})
				})
			}else return res.json({msg:"User not Found"});
		})
	}
})

router.post("/delete-teachadmin",(req,res)=>{
	data = req.body

	models.user.findOne({idUser : data.adminOpeTeachAdmin},(err,exists) => {
  		if (err) return res.send(err);
  		if(exists){
			models.user.remove({idUser : data.adminOpeTeachAdmin},(err) => {
			  	if (err) return res.send(err);
				models.adminuser.remove({idUser : data.adminOpeTeachAdmin},(err) => {
					if (err) return res.send(err);
					return res.send({msg:"User(TeachAdmin) Delete Complete"})
				})
			})
		}else return res.json({msg:"User(TeachAdmin) not Found"});
	})
})

router.post("/show-valid-step",(req,res)=>{
	var data = req.body,
		children = {},
		step = {},
		act1 = {},
		act2 = {}


	models.children.findOne({idChildren : data.idChildren},(err,childrenO) => {
		if (err) return res.send(err);
		if (!childrenO) return res.json({msg : "Children not Found"})
		children = childrenO

		models.step.findOne({stepStep : data.step},(err,step) => {
			if (err) return res.send(err);
			if (!step) return res.json({msg : "Step not Found"})
			step = step
			
			models.activity.findOne({activityActivity : 1, stepActivity : data.step},(err,act1) => {
				if (err) return res.send(err);
				if (!act1) return res.json({msg : "Act1 not Found"})

				models.activity.findOne({activityActivity : 2, stepActivity : data.step},(err,act2) => {
					if (err) return res.send(err);
					if (!act2) return res.json({msg : "Act2 not Found"})

					models.activityhistory.findOne({idChildren : childrenO._id, idActivity : act1._id})
					.sort({date : -1})
					.limit(1)
					.populate('idActivity idUser')
					.exec((err, acthis1) => {
						if (err) return res.send(err);
						if (!acthis1) return res.json({msg : "Acthis1 not Found"})
						//console.log(acthis1)
						act1 = acthis1

						models.activityhistory.findOne({idChildren : childrenO._id, idActivity : act2._id})
						.sort({date : -1})
						.limit(1)
						.populate('idActivity idUser')
						.exec((err, acthis2) => {
							if (err) return res.send(err);
							if (!acthis2) return res.json({msg : "Acthis2 not Found"})

							act2 = acthis2

							if(act2){
								res.json({message: "Children Found", children : children, step : step, act1 : act1, act2 : act2});
							}else{
								res.json({msg:"Children not found"});
							}
						})
					})
				})
			})
		})

	})
})

router.post("/valid-step",(req,res)=>{
	data = req.body
	data.idUser = req.user._id
	console.log(data)

	models.stephistory.findOne({idChildren : data.idChildren, idStep : data.idStep},(err,stephis) => {
		if (err) return res.send(err);
		if (stephis) return res.json({msg : "Step valid exists"})

			models.stephistory.create(data, function (err, step) {
				if (err) return res.send(err);
				if (step) return res.json({msg : "Step Valid Complete"})
			})
	})
})

router.post("/update-teachAdmin",(req,res)=>{
	data = req.body

	models.user.findOne({idUser : data.adminOpeTeachAdmin},(err,exists) => {
  		if (err) return res.send(err);
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