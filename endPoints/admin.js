var express = require("express"),
router = express.Router(),
bodyParser = require('body-parser')

router.use(bodyParser.urlencoded())

router.get("/menu-admin",(req,res)=>{
	res.render("menuAdmin")
})

router.get("/register-children",(req,res)=>{
	res.render("registerChildren")
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