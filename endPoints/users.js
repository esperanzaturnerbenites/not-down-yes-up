const express = require("express"),
	models = require('./../models'),
	router = express.Router(),
	bodyParser = require('body-parser'),
	passport = require('passport')


router.use(bodyParser.urlencoded({extended:false}))

router.get("/login",(req,res)=>{
	res.render("login")
})

router.get("/help-me",(req,res)=>{
	res.render("helpMe", {user:req.user})
})



//Exportar una variable de js mediante NodeJS
module.exports = router