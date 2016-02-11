const express = require("express"),
models = require('./../models'),
router = express.Router(),
bodyParser = require('body-parser')


router.use(bodyParser.urlencoded())

function authenticate(req,res){
	var data = req.body
	models.user.findOne({ userName: data.loginUser }, (err,user) => {
		console.log(user)
		if (err) return res.send(errs)
		if (user) return res.json({ message: 'Exito' , user : user})
		return res.json({ message: 'User Not Found' })
	})
}

router.get("/login",(req,res)=>{
	res.render("login")
})

router.post("/authenticate",authenticate)

//Exportar una variable de js mediante NodeJS
module.exports = router