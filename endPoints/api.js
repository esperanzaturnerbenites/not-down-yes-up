var express = require("express"),
	models = require("./../models"),
	mongoose = require("mongoose"),
	router = express.Router(),
	bodyParser = require("body-parser"),
	functions = require("./functions"),
	CTE = require("../CTE")

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended:false}))

router.use(["/new/:collection","/:collection"],(req,res,next)=>{
	var data = req.body.query || req.body.info

	if(req.params.collection == "adminuser"){
		if(data.userUser == req.user.userUser){
			return res.json({message:"No puede realizar acciones Sobre este usuario, pues esta logeado actualmente.",statusCode:CTE.STATUS_CODE.NOT_OK})
		}else if(data.typeUser == CTE.TYPE_USER.DEVELOPER){
			return res.json({message:"No puede realizar acciones sobre este tipo de usuarios.",statusCode:CTE.STATUS_CODE.NOT_OK})
		}else if(data.userUser == CTE.FIRST_USER.USERNAME){
			return res.json({message:"No puede realizar acciones sobre este usuario.",statusCode:CTE.STATUS_CODE.NOT_OK})
		}
	}
	next()
})


router.use("/:collection",(req,res,next)=>{
	if(req.method == "POST"){
		return res.send("POST")
	}else if(req.method == "PUT"){
		if(req.params.collection == "adminuser"){
			if(req.body.query.userUser){
				if(req.body.data.typeUser){
					models.adminuser.findOne({userUser:req.body.query.userUser},function(err,adminuser){
						if(adminuser.typeUser == CTE.TYPE_USER.TEACHER) return res.json({message:"Ha este usuario no se le puede actualizar el rol",type:CTE.STATUS_CODE.NOT_OK})
						next()
					})
				}
			}
		}
	}else if(req.method == "DELETE"){
		return res.send("DELETE")
	}else{
		return res.json({err:{message:"Este Verbo HTTP no esta soportado por la aplicación."}})
	}

	next()
})


/*
	Valida que un id(Identificacion) no se encuentre Registrada
	Request Data {String} id: id a Validar
	Response {Object}: Resultado de la validacion
		@property {String} msg: Menaje de Validacion
		@property {Number} statusCode: Estado de la Validacion
*/
router.post("/id-exists",(req,res)=>{
	var message = {message:"Esta Identificacion ya se encuenta Registrada",statusCode:CTE.STATUS_CODE.INFORMATION}

	models.user.findOne({idUser : req.body.id}, (err, user) => {
		message.user = user
		if(user) return res.json(message)
		models.parent.findOne({idParent : req.body.id}, (err, parent) => {
			message.parent = parent
			if(parent) return res.json(message)
			models.children.findOne({idChildren : req.body.id}, (err, children) => {
				message.children = children
				if(children) return res.json(message)

				message.message = "La Identificacion no se encuentra registrda."
				message.statusCode = CTE.STATUS_CODE.OK
				return res.json(message)
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
				if (err) return res.json({err:{message:err.message,err:err}})

				return res.json({
					message: "La crecion se realizo exitosamente.",
					statusCode: CTE.STATUS_CODE.OK,
					documents: documents
				})
			})
		},
		err => {return res.json({err:{message:err.message,err:err}})}
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

	model.find(query,projection)
	.populate("user parent activity children")
	.exec((err,documents) => {
		if (err) return res.json({err:{message:err.message,err:err}})

		params.data = documents
		var promise = fn(params)
		promise.then( 
			data => {
				return res.json({documents:documents,returnFn:data.data})
			},
			err => {
				return res.json({err:{message:err.message,err:err}})
			}
		)
	})
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
				if(err) return res.json({err:err})
				if(status.nModified) return res.json({message:"Actualizacion Completa",statusCode:CTE.STATUS_CODE.OK,status:status})
				if(!status.nModified) return res.json({message:"Actualizacion Incompleta",statusCode:CTE.STATUS_CODE.NOT_OK,status:status})
			})
		},
		err => {
			return res.json({message:err.message,statusCode:CTE.STATUS_CODE.NOT_OK})
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
			model.remove(query,function(err,status) {
				if (err) return res.json({err:err})
				return res.json({message:"Eliminacion Completa.",statusCode:CTE.STATUS_CODE.OK,status:status})
			})
		},
		err => {
			return res.json({message:err.message,statusCode:CTE.STATUS_CODE.NOT_OK})
		}

	)
})

module.exports = router
