var express = require("express"),
	models = require("./../models"),
	mongoose = require("mongoose"),
	router = express.Router(),
	bodyParser = require("body-parser"),
	functions = require("./functions"),
	CTE = require("../CTE")

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended:false}))

/*
	Valida que un id(Identificacion) no se encuentre Registrada
	Request Data {String} id: id a Validar
	Response {Object}: Resultado de la validacion
		@property {String} msg: Menaje de Validacion
		@property {Number} statusCode: Estado de la Validacion
*/
router.post("/id-exists",(req,res)=>{
	var message = {msg:"Esta Identificacion ya se encuenta Registrada",statusCode:CTE.STATUS_CODE.INFORMATION}

	models.user.findOne({idUser : req.body.id}, (err, user) => {
		if(user) return res.json(message)
		models.parent.findOne({idParent : req.body.id}, (err, parent) => {
			if(parent) return res.json(message)
			models.children.findOne({idChildren : req.body.id}, (err, children) => {
				if(children) return res.json(message)
				return res.json({msg:"Ok",statusCode:CTE.STATUS_CODE.OK})
			})
		})
	})
})

router.post("/new/:collection",(req, res) => {
	var collection = req.params.collection,
		model = mongoose.model(collection),
		data = req.body,

		/*Fn(Busquedas/Creacion) Funcion ha ejecutar*/
		fn = data.fn ? functions[data.fn] : functions["defaulFn"],

		/*Params(Busquedas/Creacion) Parametro de la Funcion ha ejecutar*/
		params = data.params ? data.params : {},
		
		/*info(Busquedas) Campos ha seleccionar*/
		info = data.info ? data.info : {}

	var promise = fn(params,info)
	promise.then(
		data => {
			model.create(info,(err,documents) => {
				if (err) return res.json(err)
					console.log("resolve")
				return res.json({documents:documents})
			})
		},
		err => {
			console.log("reject")
			return res.json({message:err})
		}
	)

})

router.post("/:collection",(req, res) => {
	var collection = req.params.collection,
		model = mongoose.model(collection),
		data = req.body,

		/*Query(Busquedas) Consulta a realizar*/
		query = data.query ? data.query : {},

		/*Fn(Busquedas/Creacion) Funcion ha ejecutar*/
		fn = data.fn ? functions[data.fn] : functions["defaulFn"],

		/*Params(Busquedas/Creacion) Parametro de la Funcion ha ejecutar*/
		params = data.params ? data.params : {},
		
		/*Projection(Busquedas) Campos ha seleccionar*/
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
