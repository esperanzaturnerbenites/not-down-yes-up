var express = require("express"),
models = require('./../models'),
router = express.Router(),
bodyParser = require('body-parser'),
querystring = require('querystring')

router.use(bodyParser.urlencoded())

router.get("/menu-admin",(req,res)=>{
	res.render("menuAdmin",{user :req.user})
})

router.all("/register-children",(req,res)=>{
	if(req.method == "GET"){	
		res.render("registerChildren")
	}else if(req.method == "POST"){
		dataChildren = querystring.parse(req.body.children),
		dataMom = querystring.parse(req.body.mom),
		dataDad = querystring.parse(req.body.dad),
		dataCare = querystring.parse(req.body.care)

		/*dataChildren.idMom = dataMom.idMom
		dataChildren.idDad = dataDad.idDad
		dataChildren.idCare = dataCare.idCare*/
		dataMom.idChildren = dataChildren.idChildren
		dataDad.idChildren = dataChildren.idChildren
		dataCare.idChildren = dataChildren.idChildren

		models.children.findOne({idChildren:dataChildren.idChildren},(err,exists) =>{
			if(err) return res.send(err);
			if(exists){
				return res.json({msg:"Children Replay"});
			}else{
				models.children.create(dataChildren, function (err, children) {
			  		if (err) return res.send(err);
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
	}
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
		
		dataUserAdmin.idUser = dataUser.idUser

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
			 res.json({valid:false, msg:"El usuario ya se encuentra registrado",statusCode:0});
		}else{
			 res.json({valid:true, msg:"",statusCode:1});
		}
	})
})

router.post("/register-newuser",(req,res)=>{
	data = req.body

	console.dir(data)

	if(data.passUser == data.newPassConfirmUser){
		models.user.findOne({idUser : data.idUser},(err,exists) => {
			if (err) return res.send(err);
			if(exists){
				models.adminuser.findOne({userUser : data.userUser},(err,existsa) => {
					if (err) return res.send(err);
					if(existsa){
						return res.json({msg:"Useradmin Replay"});
					}else{
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

router.post("/find-all",(req,res)=>{
	var data = req.body
	console.log(data)
	if(data.typeUser == "Todos"){
		models.adminuser.find({}, (err,users) =>{
			if (err) return res.send(err)
			res.json(users)	
		})
	}else{
		models.adminuser.find({typeUser : data.typeUser}, (err,users) =>{
			if (err) return res.send(err)
			res.json(users)	
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

	models.children.findOne({idChildren : data.adminOpeChildren},(err,exists) => {
  		if (err) return res.send(err);
  		if(exists){
			models.children.remove({idChildren : data.adminOpeChildren},(err) => {
			  	if (err) return res.send(err);
			  	models.mom.remove({idChildren : data.adminOpeChildren},(err) => {
				  	if (err) return res.send(err);
				  	models.dad.remove({idChildren : data.adminOpeChildren},(err) => {
					  	if (err) return res.send(err);
					  	models.care.remove({idChildren : data.adminOpeChildren},(err) => {
						  	if (err) return res.send(err);
			  				return res.send({msg:"Children Delete Complete"})
						})	
					})	
				})	
			})
		}else{
  			return res.json({msg:"Childre not Found"});
  		}
	})
})

router.post("/delete-users",(req,res)=>{
	data = req.body

	if (data.adminOpeIdUser == "admin"){
		return res.send({msg:"User not Delete"})
	}else{
		models.adminuser.findOne({userUser : data.adminOpeIdUser},(err,existsa) => {
	  		if (err) return res.send(err);
	  		if(existsa){
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

router.post("/update-children",(req,res)=>{
	data = req.body

	models.children.findOne({idChildren : data.adminOpeChildren},(err,exists) => {
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

//Exportar una variable de js mediante NodeJS
module.exports = router