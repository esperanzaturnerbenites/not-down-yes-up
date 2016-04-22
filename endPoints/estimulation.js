var express = require("express"),
	models = require("./../models"),
	mongoose = require("mongoose"),
	router = express.Router(),
	bodyParser = require("body-parser"),
	querystring = require("querystring"),
	ObjectId = mongoose.Types.ObjectId

router.use(bodyParser.urlencoded({extended:false}))

router.post("/found-step",(req,res)=>{
	var data = req.body

	models.stepvalid.find({_id : data.idChildren})
	.populate('idStep')
	.exec((err, steps) => {
		if(err) return res.json({err:err})
		if(steps) return res.json({steps : steps})
	})
})

router.post("/consul-step",(req,res)=>{
	var data = req.body

	models.step.findOne({stepStep : data.step}, (err, stepFind) => {
		models.activityhistory.find({idChildren : data.idChildren, idStep : stepFind._id})
		.sort({date:-1})
		.populate("idActivity idUser")
		.exec((err, activities) => {
			if(err) return res.json({err:err})
			if(activities) return res.json({activities : activities})
		})

	})
})

router.post("/found-children",(req,res)=>{
	var data = req.body

	models.children.findOne({idChildren : data.idChildren}, (err,children) => {
		if(err) res.json({err:err})
		if(children){ res.json(children)} else{res.json({err: {message:"¡Niñ@ no existe!"}})}
	})
})

router.post("/valid-activity-parcial",(req,res)=>{
	var data = querystring.parse(req.body.actGeneral),
		numberActivity = req.body.activityActivity,
		numberStep = req.body.stepActivity,
		user = req.user

	console.log(user)
	data.idUser = user._id
	data.nameUser = user.nameUser
	data.lastnameUser = user.lastnameUser

	models.children.findOne({idChildren : data.idChildren}, (err,children) => {
		if(err) return res.json({err:err})
		data.idChildren = children._id

		models.step.findOne({stepStep : numberStep}, (err,step) => {
			if(err) return res.json({err:err})
			data.idStep = step._id

			models.activity
			.findOne({activityActivity : numberActivity , stepActivity : numberStep},
			(err,activityF) => {
				if(err) return res.json({err:err})
				if(!activityF) return res.json({err:{message:"¡Actividad no encontrada!"}})
				data.idActivity = activityF._id
				models.activityhistory.create(data, function (err, activity) {
					if(err) return res.json({err:err})
					return res.json({msg:"¡Validación Parcial Exitosa!",statusCode : 0, activity : activity})
				})
			})
		})
	})
})

router.post("/valid-activity-complete",(req,res)=>{
	var data = querystring.parse(req.body.actGeneral),
		numberActivity = req.body.activityActivity,
		numberStep = req.body.stepActivity,
		user = req.user

	console.log(user._id)
	data.idUser = user._id
	data.nameUser = user.nameUser
	data.lastnameUser = user.lastnameUser

	models.children.findOne({idChildren : data.idChildren}, (err,children) => {
		if(err) return res.json({err:err})
		data.idChildren = children._id

		models.step.findOne({stepStep : numberStep}, (err,step) => {
			if(err) return res.json({err:err})
			data.idStep = step._id

			models.activity
			.findOne({activityActivity : numberActivity , stepActivity : numberStep},
			(err,activityF) => {
				if(err) return res.json({err:err})
				if(!activityF) return res.json({err:{message:"¡Actividad no encontrada!"}})
				else {
					data.idActivity = activityF._id

					models.activityhistory.find({idChildren : data.idChildren, idStep : data.idStep, idActivity : data.idActivity}, (err,acthis) => {
						if(err) return res.json({err:err})
						if(!acthis) return res.json({err:{message:"¡Niñ@ no ha sido validado anteriormente en esta actividad!"}})
						
						var activitiesvalid = 0

						for(var actsh in acthis){
							if(actsh.statusActivity == 1)
								activitiesvalid++
						}

						if((data.statusActivity == 1 && activitiesvalid >= 3) || data.statusActivity == 0){
							models.activityvalid
							.findOne({idChildren : data.idChildren, idStep : data.idStep, idActivity : data.idActivity},
							(err,actvalidFind) =>{
								if(err) return res.json({err:err})
								if(actvalidFind){
									//PREGUNTAR SI QUIERE HACER EL UPDATE
									models.activityvalid.update(
										{idChildren : data.idChildren, idStep : data.idStep, idActivity : data.idActivity},
										{"$set": data},
										(err,doc) => {
											if(err) return res.json({err:err})
											if(doc) return res.json({msg:"¡Validación Semestral Exitosa (Actualización)!", statusCode:0, activity : doc})
										})
								} else{
									models.activityvalid.create(data, function (err,activity) {
										if(err) return res.json({err:err})
										return res.json({msg:"¡Validación Semestral Exitosa (Primera vez)!", statusCode:0, activity : activity})
									})
								}
							})
						}else return res.json({err:{message:"¡Niñ@ no cumple con las condiciones necesarias para validar éxitosamente esta actividad!"}})
					})
				}
			})
		})
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

router.get("/infoChildren/:id",(req,res)=>{
	const idChildren = parseInt(req.params.id)
	var dataChildren = {}

	models.children.findOne({idChildren: idChildren}, (err, children) => {
		if(err) return res.json({err:err})
		if(!children) return res.json({"msg":"Children not found"})
		dataChildren = children

		models.parent.find({idChildren : {$in : [children._id]}})
		.sort({relationshipParent:1})
		.exec((err, parents) => {
			if(err) return res.json({err:err})
			if(!parents) return res.json({"msg":"Parents not found"})
			dataChildren.parents = parents

			models.activityhistory.find({idChildren: children._id})
			.sort({date:-1})
			.limit(10)
			.populate("idActivity idStep idUser")
			.exec((err, activities) => {
				if(err) return res.json({err:err})
				if(activities.length){
					dataChildren.activities = activities

					models.activityvalid.find({idChildren:children._id, idStep : activities[0].idStep})
					.populate("idActivity idStep idUser")
					.exec((err, actsvalid) => {
						if(err) return res.json({err:err})
						dataChildren.actsvalid = actsvalid
						//console.log(dataChildren.actsvalid[0].statusActivity)
						return res.render("continueOne",{childrenAct:dataChildren})
					})
				}else {return res.render("continueOne",{childrenAct:dataChildren})}
			})
		})
	})
})

router.get("/steps",(req,res)=>{
	var step = {}

	models.step.find({}, (err, stepDB) => {
		step = stepDB
		//console.dir(step)
		res.render("stepMenu",{steps:step})
	})
})

router.get("/steps/:step",(req,res)=>{
	const numberStep = parseInt(req.params.step)
	var step = {}

	models.step.findOne({stepStep:numberStep}, (err, stepDB) => {
		step = stepDB
		models.activity.find({stepActivity:numberStep}, (err, activities) => {
			step.activities = activities
			res.render("stepDetail",{step:step})
		})
	})
})

router.get("/steps/:step/:activity",(req,res)=>{
	const numberStep = parseInt(req.params.step),
		numberActivity = parseInt(req.params.activity)
	var activity = {}

	models.activity.findOne({stepActivity : numberStep, activityActivity : numberActivity}, (err, activityDB) => {
		activity = activityDB

		models.step.findOne({step : activityDB.stepActivity}, (err, stepDB) => {
			activity.step = stepDB
			res.render("activity",{activity:activity, user:req.user})
		})
	})
})
/*
var five = require("johnny-five"),
	board,
	led,
	button0,
	button1,
	button2,
	button3

function validatePress(button,data){

	led.toggle()
	console.log("press")
	var numberPin = button.pin,
		numberPinCorrect = parseInt(data.numberPin) || 54

	console.log("number pin " + numberPin)
	if(numberPin == numberPinCorrect){
		console.log({msg: "Correcto"})
	}else{
		console.log({msg: "Incorrecto"})
	}
}

router.post("/arduino/init",(req,res)=>{
	var data = req.body
	board = new five.Board()
	board.on("ready", function() {
		button0 = new five.Button("A0"),
		button1 = new five.Button("A1"),
		button2 = new five.Button("A2"),
		button3 = new five.Button("A3"),
		led = new five.Led(13)
	})
	console.log(data)
	if(board.isReady){
		button0.on("press", () => {
			validatePress(button0,data)
		})
		button1.on("press", () => {
			validatePress(button1,data)
		})
		button2.on("press", () => {
			validatePress(button2,data)
		})
		button3.on("press", () => {
			validatePress(button3,data)
		})
		res.json({msg: "Actividad Iniciada"})
	}
})*/



//Exportar una variable de js mediante NodeJS
module.exports = router
