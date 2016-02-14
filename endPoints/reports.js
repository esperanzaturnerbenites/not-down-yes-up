const express = require("express"),
models = require('./../models'),
router = express.Router(),
bodyParser = require('body-parser'),
passport = require('passport')


router.use(bodyParser.urlencoded())

router.post("/general",(req,res)=>{
	models.children.find().lean().exec((err,childrens) =>{
		if (err) return res.send(err)
		for (children of childrens){
			//var activities = models.activityhistory.find({idChildren: children.idChildren}).lean()
			children.acitivities = "activities"
		}
		res.json(childrens)	
	})
})



//Exportar una variable de js mediante NodeJS
module.exports = router