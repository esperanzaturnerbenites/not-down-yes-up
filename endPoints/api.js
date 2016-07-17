var express = require("express"),
	models = require("./../models"),
	mongoose = require("mongoose"),
	router = express.Router(),
	bodyParser = require("body-parser"),
	functions = require("./functions")

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
				console.log(returnFn)
			}

			return res.json({documents:documents,returnFn:returnFn})
		})
})

module.exports = router
