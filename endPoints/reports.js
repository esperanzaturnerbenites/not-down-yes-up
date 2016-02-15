const express = require("express"),
models = require('./../models'),
router = express.Router(),
bodyParser = require('body-parser'),
passport = require('passport')


router.use(bodyParser.urlencoded())

router.post("/general",(req,res)=>{
	var data = []
	models.children.find().lean().exec((err,childrens) =>{
		if (err) return res.send(err)
		for (children of childrens){
			console.log(children.idChildren)
			models.activityhistory.find({idChildren: children.idChildren}).lean().exec((err,acitivities) =>{
				if (err) return res.send(err)
				children.act = acitivities
				console.dir(acitivities)
			})
			data.push(children)
		}
		res.json(data)	
	})
})



//Exportar una variable de js mediante NodeJS
module.exports = router