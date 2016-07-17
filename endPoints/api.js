var express = require("express"),
	models = require("./../models"),
	mongoose = require("mongoose"),
	router = express.Router(),
	bodyParser = require("body-parser")

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended:false}))

router.post("/:collection",(req, res) => {
	var collection = req.params.collection,
		model = mongoose.model(collection),
		data = req.body,
		query = data.query ? data.query : {},
		projection = data.projection ? data.projection : {}

	console.log(data)

	model.find(query,projection)
		.populate('user parent activity children')
		.exec((err,documents) => {
			if (err) return res.json({err:err})
			return res.json(documents)
		})
})

module.exports = router
