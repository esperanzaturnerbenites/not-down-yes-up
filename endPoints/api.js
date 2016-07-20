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
		fn = data.fn ? functions[data.fn] : functions["defaulFn"],
		params = data.params ? data.params : {},
		projection = data.projection ? data.projection : {}

	var promise = fn(params)
	promise.then(
		data => {
			model.find(query,projection)
				.populate("user parent activity children")
				.exec((err,documents) => {
					if (err) return res.json({err:err})
					params.data = documents
					return res.json({documents:documents,returnFn:data.data})
				})
			
		},
		err => {
			return res.json({message:err.message})
		}
		)

})

router.put("/:collection",(req, res) => {
	var collection = req.params.collection,
		model = mongoose.model(collection),
		data = req.body,
		query = data.query ? data.query : {},
		dataUpdate = data.data ? data.data : {},
		fn = data.fn ? functions[data.fn] : functions["defaulFn"],
		params = data.params ? data.params : {}

	var promise = fn(params,dataUpdate,res)

	promise.then(
		data => {
			model.update(query,dataUpdate,function(err,status) {
				if (err) return res.json({err:err})
				if (status.nModified) return res.json({msg:"Actualizacion Completa",statusCode:CTE.STATUS_CODE.OK,status:status})
				if (!status.nModified) return res.json({msg:"Actualizacion Incompleta",statusCode:CTE.STATUS_CODE.NOT_OK,status:status})
			})
		},
		err => {
			console.log("callback reject")
			return res.json({msg:err.message,statusCode:CTE.STATUS_CODE.NOT_OK})
		}
	)
})

router.delete("/:collection",(req, res) => {
	var collection = req.params.collection,
		model = mongoose.model(collection),
		data = req.body,
		query = data.query ? data.query : {},
		dataUpdate = data.data ? data.data : {},
		fn = data.fn ? functions[data.fn] : functions["defaulFn"],
		params = data.params ? data.params : {}

	var promise = fn(params,dataUpdate,res)

	promise.then(
		data => {
			console.log("callback resolve")
			model.remove(query,function(err,status) {
				if (err) return res.json({err:err})
				return res.json({msg:"Eliminacion Completa.",statusCode:CTE.STATUS_CODE.OK,status:status})
			})
		},
		err => {
			console.log("callback reject")
			return res.json({msg:err.message,statusCode:CTE.STATUS_CODE.NOT_OK})
		}

	)
})

module.exports = router
