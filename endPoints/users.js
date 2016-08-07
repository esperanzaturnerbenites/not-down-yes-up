const express = require("express"),
	router = express.Router(),
	bodyParser = require("body-parser"),
	dataManualUser = require("../dataManualUser")

router.use(bodyParser.urlencoded({extended:false}))

router.get("/login",(req,res)=>{res.render("login")})

router.get("/about",(req,res)=>{res.render("about")})

router.get("/help-me",(req,res)=>{
	res.render("helpMe",{manual:dataManualUser})
})

module.exports = router