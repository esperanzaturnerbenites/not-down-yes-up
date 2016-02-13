var express = require("express"),
router = express.Router(),
bodyParser = require('body-parser')

router.use(bodyParser.urlencoded())
	
router.get("/menu-teacher",(req,res)=>{
	res.render("menuTeacher")
})

router.get("/continue",(req,res)=>{
	res.render("continue")
})

router.get("/continue/continue-detail",(req,res)=>{
	res.render("continueDetail")
})

router.get("/steps",(req,res)=>{
	res.render("steps")
})

router.get("/steps/step1",(req,res)=>{
	res.render("step1")
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
	res.render("step1Act1")
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