var express = require("express"),
	models = require("./../models"),
	mongoose = require("mongoose"),
	router = express.Router(),
	bodyParser = require("body-parser"),
	querystring = require("querystring"),
	passport = require("passport"),
	ObjectId = mongoose.Types.ObjectId

router.use(bodyParser.urlencoded({extended:false}))

router.post("/found-childrens",(req,res)=>{
	var data = req.body

	models.children.findOne({idChildren : data.idChildren}, (err,children) => {
		if(err) return res.json({err:err})
		if(children) return res.json(children)
		return res.json({msg:"¡Niñ@ no existe!", statusCode:2})
	})
})

router.post("/consul-step",(req,res)=>{
	var data = req.body,
		steps = {}

	models.step.findOne({stepStep:data.consulStep},(err,step) => {
		if(err) return res.json({err:err})
		if(!step) return res.json({err:{message:"Not steps"}})
		steps.step = step

		models.stepvalid.find({idStep:step._id})
		.sort({idChildren : 1})
		.populate("idChildren idUser idStep")
		.exec((err, stephis) => {
			if (err) return res.json(err)
			if (!stephis) return res.json({"msg":"Stephis not found"})
			var idsChild = stephis.map(e => {return {idChildren:e.idChildren._id}})
			steps.stepval = stephis

			models.activityvalid.find({idStep:step._id, $or:idsChild})
			.sort({idChildren : 1})
			.exec((err,actsval) =>{
				if (err) return res.json(err)
				if(!actsval) return res.json({"msg":"actsval not found"})
				steps.actsval = actsval

				models.activity.count({stepActivity:step.stepStep},(err,numact) =>{
					if(err) return res.json({err:err})
					if(!numact) return res.json({err:{message:"Not Activities"}})
					steps.numact = numact
					console.log(numact)
					return res.json({msg : "Consult Complete", steps :steps})
				})
			})
		})
	})
})

router.post("/consul-step-acts",(req,res)=>{
	var data = req.body,
		steps = {}

	models.activity.find({stepActivity:data.stepStep},(err,stepActs) =>{
		if(err) return res.json({err:err})
		if(stepActs.length < 1) return res.json({err:{message:"Not Activities"}})
		steps = stepActs
		return res.json({msg : "Consult Complete", steps :steps})
	})
})

router.post("/general",(req,res)=>{
	var info = {}

	models.activityhistory.find({})
	.sort({idChildren : 1})
	.populate("idChildren idUser idActivity")
	.exec((err,acthistory) =>{
		if (err) return res.json({err:err})
		if(!acthistory) return res.json({err:{"msg":"Childrens not found"}})
		//.acthistory = acthistory

		models.activityvalid.find({})
		.sort({idChildren : 1})
		.populate("idChildren idUser idActivity")
		.exec((err,actvalid) =>{
			if (err) return res.json({err:err})
			if(!actvalid) return res.json({err:{"message":"Childrens not found"}})
			//.actvalid = actvalid

			models.stepvalid.find({})
			.sort({idStep : 1})
			.populate("idChildren idStep")
			.exec((err, stepvalid) => {
				if (err) return res.json({err:{message:err}})
				if (!stepvalid) return res.json({"msg":"Stephis not found"})

				var data = {}

				stepvalid.forEach(sv => {
					if(!data[sv.idChildren.idChildren]) data[sv.idChildren.idChildren] = []
					var dataAux = {}
					dataAux[sv.idStep.stepStep] = sv
					data[sv.idChildren.idChildren].push(dataAux)
				})

				console.log(data)

				info.stepvalid = stepvalid
				return res.json({msg : "Consult Complete", statusCode : 0, info : info})
			})
		})
	})
})

router.get("/info-children/:id",(req,res)=>{
	var id = req.params.id,
		data = {}

	console.log(id)

	models.children.findOne({idChildren : id})
	.populate('idParent.idParent')
	.exec((err, children) => {
		if (err) {res.json(err)}
		if(!children) {return res.json({"msg":"¡Niñ@ no existe!", statusCode:2})}
			
		data.child = children
		data.parents = children.idParent.map(objParent => {return objParent.idParent})

		console.log(data.child)

		models.activityhistory.find({idChildren: children._id})
		.sort({date:-1})
		.populate("idActivity idUser idStep")
		.exec((err, activitiesH) => {
			if (err) return res.json({err:err})
			if(!activitiesH) {return res.json({"msg":"Activities history not found"})}
			data.historys = activitiesH

			models.activityvalid.find({idChildren: children._id})
			.sort({date:-1})
			.populate("idActivity idUser idStep")
			.exec((err, activitiesV) => {
				if (err) return res.json({err:err})
				if(!activitiesV) {return res.json({"msg":"Activities valid not found"})}
				if(activitiesV) {
					data.valids = activitiesV
					models.stepvalid.find({idChildren:children._id})
					.sort({date:-1})
					.populate("idStep idUser")
					.exec((err,stepvalidChild) =>{
						if(err) return res.json({err:err})
						if(!stepvalidChild) return res.json({err:{message:"No tiene etapas - Valid"}})
						if(stepvalidChild){
							data.stepvalids = stepvalidChild
							res.render("infoChildren",{infoChildren: data})
							//return res.json({message : "¡Correcto!",statusCode:0, infoChildren : data})
						}
					})
				}
			})
		})
	})
})

//Exportar una variable de js mediante NodeJS
module.exports = router