var express = require("express"),
models = require('./../models'),
mongoose = require("mongoose"),
router = express.Router(),
bodyParser = require('body-parser'),
querystring = require('querystring'),
ObjectId = mongoose.Types.ObjectId

router.use(bodyParser.urlencoded())

router.post("/found-children",(req,res)=>{
	var data = req.body

	models.children.findOne({idChildren : data.idChildren}, (err,children) => {
		if (err) res.send(err)
		if(children){ res.json(children)} else{res.json({"msg":"Children not found"})}
	})
})

router.post("/valid-activity-complete",(req,res)=>{
	var data = req.body

	models.adminuser.findOne({userUser : data.userUser}, (err,user) => {
		if (err) res.send(err)
		if(user){
			data.idUser = user._id
			models.children.findOne({idChildren : data.idChildren}, (err,children) => {
				if (err) res.send(err)
				if(children){
					data.idChildren = children._id
					res.json(children)
				} else{res.json({"msg":"Children not found"})}
			})
		}else{res.json({"msg":"User not found"})}
	})

})

router.get("/menu-teacher",(req,res)=>{
	res.render("menuTeacher",{user :req.user})
})

router.get("/continue-one",(req,res)=>{
	res.render("continueOne")
})

router.get("/continue-group",(req,res)=>{
	res.render("continueGroup")
})

router.get("/continue/continue-detail-one",(req,res)=>{
	res.render("continueDetailOne")
})

router.get("/steps",(req,res)=>{
	res.render("steps")
})

router.get("/steps/step1",(req,res)=>{
	var step = 1
	res.render("step1", step)//Revisar porque tengo mucho sueño, y depronto termino dañandolo...
})

router.get("/steps/step2",(req,res)=>{
	res.render("step2")
})

router.get("/steps/step3",(req,res)=>{
	res.render("step3")
})

router.get("/steps/step4",(req,res)=>{
	res.render("step4")
})

router.get("/steps/step1-act1",(req,res)=>{
	res.render("step1Act1", {user :req.user})
})

router.get("/steps/step1-act2",(req,res)=>{
	res.render("step1Act2")
})

router.get("/steps/step2-act1",(req,res)=>{
	res.render("step2Act1")
})

router.get("/steps/step2-act2",(req,res)=>{
	res.render("step2Act2")
})

router.get("/steps/step3-act1",(req,res)=>{
	res.render("step3Act1")
})

router.get("/steps/step3-act2",(req,res)=>{
	res.render("step3Act2")
})

router.get("/steps/step4-act1",(req,res)=>{
	res.render("step4Act1")
})

router.get("/steps/step4-act2",(req,res)=>{
	res.render("step4Act2")
})

router.get("/steps/:step/:activity",(req,res)=>{
	const step = req.params.step,
	activity = req.params.activity
	console.log(activity)
	res.render("step4Act2")
})

//Exportar una variable de js mediante NodeJS
module.exports = router