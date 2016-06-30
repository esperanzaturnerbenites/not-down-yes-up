const express = require("express"),
	router = express.Router(),
	bodyParser = require("body-parser")

router.use(bodyParser.urlencoded({extended:false}))

router.get("/login",(req,res)=>{res.render("login")})

router.get("/help-me",(req,res)=>{res.render("helpMe")})

//Exportar una variable de js mediante NodeJS
module.exports = router