var express = require("express"),
	models = require("./../models"),
	mongoose = require("mongoose"),
	router = express.Router(),
	bodyParser = require("body-parser"),
	functions = require("./functions"),
	CTE = require("../CTE")

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended:false}))

router.post("/:collection",(req, res) => {
	var collection = req.params.collection,
		model = mongoose.model(collection),
		data = req.body,
		query = data.query ? data.query : {},
		fn = data.fn ? functions[data.fn] : false,
		params = data.params ? data.params : {},
		projection = data.projection ? data.projection : {}

	model.find(query,projection)
		.populate('user parent activity children')
		.exec((err,documents) => {
			if (err) return res.json({err:err})
			params.data = documents
			if(fn){
				var returnFn = fn(params)
			}
			return res.json({documents:documents,returnFn:returnFn})
		})
})

router.put("/:collection",(req, res) => {
	var collection = req.params.collection,
		model = mongoose.model(collection),
		data = req.body,
		query = data.query ? data.query : {},
		dataUpdate = data.data ? data.data : {},
		fn = data.fn ? functions[data.fn] : false,
		params = data.params ? data.params : {}

	if(fn) fn(params,dataUpdate,res)

	model.update(query,{$set:dataUpdate},function(err,status) {
		if (err) return res.json({err:err})
		return res.json({msg:"Actualizacion Completa",statusCode:CTE.STATUS_CODE.OK,status:status})
	})
})

router.delete("/:collection",(req, res) => {
	var collection = req.params.collection,
		model = mongoose.model(collection),
		data = req.body,
		query = data.query ? data.query : {},
		dataUpdate = data.data ? data.data : {},
		fn = data.fn ? functions[data.fn] : false,
		params = data.params ? data.params : {}

	console.log(".......")
	console.log(1)
	console.log(".......")
	if(fn) fn(params,dataUpdate,res)
	console.log(".......")
	console.log(2)
	console.log(".......")
	console.log(query)

	model.remove(query,function(err,status) {
		if (err) return res.json({err:err})
		return res.json({msg:"Eliminacion Completa.",statusCode:CTE.STATUS_CODE.OK,status:status})
	})
})

module.exports = router
