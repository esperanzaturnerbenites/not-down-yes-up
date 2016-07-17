var Mongoose = require("mongoose")

/* Definicion de Esquemas de la DB*/
const userSchema = new Mongoose.Schema({
	idUser: {type:Number, required:true},
	expeditionUser: {type:String},
	nameUser: {type:String},
	lastnameUser : {type:String},
	ageUser: {type:Number},
	imgUser: {type:String},
	telUser: {type:Number},
	celUser: {type:Number},
	emailUser: {type:String},
	addressUser: {type:String},
	districtUser: {type:String},
	localityUser: {type:String},
	departamentUser: {type:String},
	studyUser: {type:Number},
	professionUser: {type:String},
	experienceUser: {type:Number},
	centerUser: {type:String}
})

/* Creacion de los Modelos de la DB*/
/*
	El nombre de la coleccion se pasa en singular, y mongoose la crea en plular en la DB
	Mongoose.model('singularName', schema)
*/
var User = Mongoose.model("user", userSchema),
	models = {
		parent : require("./parent"),
		children : require("./children")
	}

userSchema.pre("save",function (next) {
	User.findOne({idUser : this.idUser}, (err, user) => {
		if(user) next(new Error("¡Usuario ya existe!"))
		models.parent.findOne({idParent : this.idUser}, (err, parent) => {
			if(parent) next(new Error("Esta Identificacion Se encuenta Registrada!"))
			models.children.findOne({idChildren : this.idUser}, (err, children) => {
				if(children) next(new Error("Esta Identificacion Se encuenta Registrada!"))
				else next()
			})
		})
	})
})

module.exports = User