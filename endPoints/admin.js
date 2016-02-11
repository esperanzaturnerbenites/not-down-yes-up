var express = require("express"),
models = require('./../models'),
router = express.Router(),
bodyParser = require('body-parser'),
querystring = require('querystring')

router.use(bodyParser.urlencoded())

router.get("/menu-admin",(req,res)=>{
	res.render("menuAdmin")
})

router.all("/register-children",(req,res)=>{
	if(req.method == "GET"){	
		res.render("registerChildren")
	}else if(req.method == "POST"){
		dataChildren = querystring.parse(req.body.children)
		models.user.create(dataChildren, function (err, children) {
  		if (err) return res.send(err);
  		return res.json({message:"User Add Complete", children : children})
})
	}
})

router.get("/register-user",(req,res)=>{
	res.render("registerUserRol")
})

router.get("/admin-users",(req,res)=>{
	res.render("adminUsers")
})

router.get("/reports",(req,res)=>{
	res.render("report")
})

//Exportar una variable de js mediante NodeJS
module.exports = router