const express = require("express"),
models = require('./../models'),
router = express.Router(),
bodyParser = require('body-parser'),
passport = require('passport')


router.use(bodyParser.urlencoded())

router.post("/general",(req,res)=>{
	var data = []
	models.children.find({},(err,childrens) =>{
		models.activityhistory.populate(childrens, {path: "_id/idChildren"},function(err, childrens){
			if (err) return res.send(err)
			res.json(childrens)
		})
	})
})

//Exportar una variable de js mediante NodeJS
module.exports = router