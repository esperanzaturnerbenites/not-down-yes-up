var Mongoose = require("mongoose")

/* Definicion de Esquemas de la DB*/
const parentSchema = new Mongoose.Schema({
	idParent: {type:Number, required:true},
	idExpeditionParent: {type:String},
	nameParent: {type:String},
	lastnameParent: {type:String},
	birthdateParent: {type:Date},
	imgParent: {type:String},
	telParent: {type:Number},
	celParent: {type:Number},
	emailParent: {type:String},
	studyParent: {type:String},
	professionParent: {type:String},
	jobParent: {type:String}
})

/* Creacion de los Modelos de la DB*/
/*
	El nombre de la coleccion se pasa en singular, y mongoose la crea en plular en la DB
	Mongoose.model('singularName', schema)
*/
var Parent = Mongoose.model("parent", parentSchema),
	models = {
		children : require("./children"),
		user : require("./user")
	}

parentSchema.pre("save",function (next) {
	Parent.findOne({idParent : this.idParent}, (err, parent) => {
		if(parent) next(new Error("¡Familiar ya existe!"))
		models.user.findOne({idUser : this.idParent}, (err, user) => {
			if(user) next(new Error("Esta Identificacion Se encuenta Registrada!"))
			models.children.findOne({idChildren : this.idParent}, (err, children) => {
				if(children) next(new Error("Esta Identificacion Se encuenta Registrada!"))
				else next()
			})
		})
	})
})

module.exports = Parent