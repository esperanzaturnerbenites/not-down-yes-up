var express = require("express"),
models = require('./../models'),
mongoose = require("mongoose"),
router = express.Router(),
bodyParser = require('body-parser'),
querystring = require('querystring'),
passport = require('passport'),
ObjectId = mongoose.Types.ObjectId


router.use(bodyParser.urlencoded())

router.post("/general",(req,res)=>{
	var step = {}

	models.activityhistory.find({})
	.sort({idChildren : 1})
	.populate('idChildren idUser idActivity')
	.exec((err,childrens) =>{
		console.log("general - populate activityhistory "+childrens)
		if (err) return res.json(err)
		if(!childrens) return res.json({"msg":"Childrens not found"})

		models.stephistory.find({})
		.sort({idStep : 1})
		.populate('idChildren')
		.exec((err, stephis) => {
			if (err) return res.json(err)
			if (!stephis) return res.json({"msg":"Stephis not found"})
			steps = stephis
			return res.json({message : "Consult Complete", childrens : childrens, steps :steps})
		})
	})
})

router.post("/children",(req,res)=>{
	var data = req.body,
		dataChildren = {},
		mom = {},
		dad = {},
		care = {},
		activities = {}

	console.log(data)

	models.children.findOne({idChildren : data.idChildren}, (err, children) => {
		if (err) {res.json(err)}
		if(!children) {res.json({"msg":"Children not found"})}
		dataChildren = children

		models.mom.findOne({idChildren : children._id}, (err, mom) => {
			if (err) {res.json(err)}
			if(!mom) {res.json({"msg":"Mom not found"})}
			mom = mom

			models.dad.findOne({idChildren : children._id}, (err, dad) => {
				if (err) {res.json(err)}
				if(!dad) {res.json({"msg":"Dad not found"})}
				dad = dad

				models.care.findOne({idChildren : children._id}, (err, care) => {
					if (err) {res.json(err)}
					if(!care) {res.json({"msg":"Care not found"})}
					care = care

					models.activityhistory.find({idChildren: dataChildren._id})
					.sort({date:-1})
					.populate('idActivity idUser')
					.exec((err, activities) => {
						activities = activities

						if (err) res.json({err:err})
						if(!activities) {res.json({"msg":"Activities not found"})}
						else{res.json({message : "Consult children Complete", children : dataChildren, activities : activities, mom : mom, dad : dad, care :care})}
					})
				})
			})
		})
	})
})

//Exportar una variable de js mediante NodeJS
module.exports = router