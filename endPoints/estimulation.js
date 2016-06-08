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

	models.stepvalid.find({idChildren : data.idChildren})
	.populate("idStep idUser")
	.exec((err, steps) => {
		if(err) return res.json({err:err})
		if(steps) return res.json({steps : steps})
	})
})

router.post("/consul-step",(req,res)=>{
	var data = req.body,
		dataFind = {}

	models.step.findOne({stepStep : data.step}, (err, stepFind) => {
		dataFind.steps = stepFind

		models.activityhistory.find({idChildren : data.idChildren, idStep : stepFind._id})
		.sort({date:-1})
		.populate("idActivity idUser")
		.exec((err, activities) => {
			if(err) return res.json({err:err})
			data.activities = activities
			//console.log(data)
			if(activities) return res.json({data : data})
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

	//console.log(user)
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

					models.children.findOneAndUpdate(
					{idChildren : children.idChildren},
					{$set:{statusChildren:1}},
					(err,doc) => {
						if(err) return res.json({err:err})
						if(doc) return res.json({msg:"¡Validación Parcial Exitosa!",statusCode : 0, activity : activity})
					})
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

	//console.log(user._id)
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
											models.children.findOneAndUpdate(
											{idChildren : children.idChildren},
											{$set:{statusChildren:1}},
											(err,docChild) => {
												if(err) return res.json({err:err})
												if(docChild) return res.json({msg:"¡Validación Semestral Exitosa (Actualización)!", statusCode:0, activity : doc})
											})
										})
								} else{
									models.activityvalid.create(data, function (err,activity) {
										models.children.findOneAndUpdate(
											{idChildren : children.idChildren},
											{$set:{statusChildren:1}},
											(err,docChild) => {
												if(err) return res.json({err:err})
												if(docChild) return res.json({msg:"¡Validación Semestral Exitosa (Primera vez)!", statusCode:0, activity : activity})
											})
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

	models.children.findOne({idChildren: idChildren})
	.populate('idParent.idParent')
	.exec((err, children) => {
		if(err) return res.json({err:err})
		if(!children) return res.json({"msg":"Children not found"})
		dataChildren = children
		
		dataChildren.parents = children.idParent.map(objParent => {return objParent.idParent})

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
					//console.log(dataChildren.actsvalid.length)
					return res.render("continueOne",{childrenAct:dataChildren})
				})
			}else {return res.render("continueOne",{childrenAct:dataChildren})}
		})
	})
})

router.get("/steps",(req,res)=>{
	var step = {}

	models.step.find({})
	.sort({stepStep:1})
	.exec((err, stepDB) => {
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
		models.activity.find({stepActivity:numberStep})
		.sort({activityActivity:1})
		.exec((err, activities) => {
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

function validatePress(button,data,req){

	var numberPin = button.custom.pin,
		numberPinCorrect = parseInt(data.numberPin),
		response = {}

	console.log("number pin " + numberPin)
	if(numberPin == numberPinCorrect){
		response.msg = "Correcto"
	}else{
		response.msg = "Incorrecto"
	}
	req.io.sockets.emit("response", {reponse: response})
}

router.post("/arduino/init",(req,res)=>{
	var five = require("johnny-five"),
		board = new five.Board()

	var data = req.body

	board.on("ready", function() {

		var button1 = new five.Button({pin :8, custom :{pin: 1}}),
			button2 = new five.Button({pin :9, custom :{pin: 2}}),
			button3 = new five.Button({pin :10, custom :{pin: 3}}),
			button4 = new five.Button({pin :11, custom :{pin: 4}})
			//,led = new five.Led(9)

		button1.on("press", () => {validatePress(button1,data,req)})
		button2.on("press", () => {validatePress(button2,data,req)})
		button3.on("press", () => {validatePress(button3,data,req)})
		button4.on("press", () => {validatePress(button4,data,req)})
		res.json({msg: "Actividad Iniciada"})
	})
})

//Exportar una variable de js mediante NodeJS
module.exports = router
