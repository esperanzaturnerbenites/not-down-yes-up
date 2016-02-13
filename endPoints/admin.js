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

router.all("/register-user",(req,res)=>{
	if(req.method == "GET"){	
		res.render("registerUserRol")
	}else if(req.method == "POST"){
		dataUser = querystring.parse(req.body.userAdd),
		dataUserAdmin = querystring.parse(req.body.userAdmin)

		models.user.findOne({idUser : dataUser.idUser},(err,exists) => {
	  		if (err) return res.send(err);
	  		if(exists){
	  			return res.json({msg:"User Replay"});
	  		}else{
		  		models.user.create(dataUser, function (err, user) {
		  		if (err) return res.send(err);
					models.adminuser.create(dataUserAdmin, function (err, adminuser) {
			  		if (err) return res.send(err);
			  		return res.json({message:"User Add Complete", adminuser : adminuser})
					})
				})
  			}
		})
	}
})

router.get("/admin-users",(req,res)=>{
	res.render("adminUsers")
})

router.post("/update-pass",(req,res)=>{
	data = req.body

	models.adminuser.findOneAndUpdate(
		{userUser : data.adminIdUser},
		{$set:{passUser:data.adminPassUser}},
		(err,doc) => {
  			if (err) return res.send(err);
		  	return res.json({message:"Password Chage Complete", adminuser : doc})
		}

	)
})

router.post("/delete-childrens",(req,res)=>{
	data = req.body

	models.children.findOne({idChildren : data.adminOpeChildren},(err,exists) => {
  		if (err) return res.send(err);
  		if(exists){

			models.children.remove({idChildren:data.adminOpeChildren},(err) => {
			  	if (err) return res.send(err);
			  	return res.send({msg:"Delete Complete"})

			})
		}else{
  			return res.json({msg:"Childre not Found"});
  		}
	})

})


router.get("/reports",(req,res)=>{
	res.render("report")
})

//Exportar una variable de js mediante NodeJS
module.exports = router