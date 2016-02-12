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
		models.children.create(dataChildren, function (err, children) {
	  		if (err) return res.send(err);
	  		return res.json({message:"Children Add Complete", children : children})
		})
	}
})

router.all("/register-user",(req,res)=>{
	if(req.method == "GET"){	
		res.render("registerUserRol")
	}else if(req.method == "POST"){
		dataUser = querystring.parse(req.body.userAdd),
		dataUserAdmin = querystring.parse(req.body.userAdmin)

		console.log(dataUser)

		models.user.findOne({idUser : dataUser.idUser},(err,exists) => {
	  		if (err) return res.send(err);
	  		if(exists){
	  			return res.json({msg:"User Replay"});
	  		}else{
		  		models.user.create(dataUser, function (err, user) {
		  		if (err) return res.send(err);
					models.adminUser.create(dataUserAdmin, function (err, adminUser) {
			  		if (err) return res.send(err);
			  		return res.json({message:"User Add Complete", adminUser : adminUser})
					})
				})
  			}

		})

		
	}
})

router.all("/admin-users",(req,res)=>{
	if(req.method == "GET"){	
		res.render("adminUsers")
	}else if(req.method == "POST"){
		data = req.body
		console.log(data)

		models.adminUser.update(({userUser : data.adminIdUser},{$set:{passUser:data.adminPassUser}}), function (err, adminUser) {
	  		if (err) return res.send(err);
	  		return res.json({message:"Password Chage Complete", adminUser : adminUser})
		})
	}
})

router.post("/delete-users",(req,res)=>{
	data = req.body

	console.log(data.adminOpeChildren)

	models.children.remove({n:data.adminOpeChildren},(err) => {
	  	if (err) return res.send(err);
	  	return res.send({msg:"Delete Complete"})

	})

})


router.get("/reports",(req,res)=>{
	res.render("report")
})

//Exportar una variable de js mediante NodeJS
module.exports = router