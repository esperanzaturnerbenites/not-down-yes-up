var Mongoose = require("mongoose")

/* Definicion de Esquemas de la DB*/
const childrenSchema = new Mongoose.Schema({
	idChildren: {type:Number, required:true},
	nameChildren: {type:String},
	lastnameChildren: {type:String},
	imgChildren: {type:String},
	birthdateChildren: {type:Date},
	birthplaceChildren: {type:String},
	ageChildren: {type:Number},
	genderChildren: {type:Number},
	liveSon: {type:Number},
	addressChildren: {type:String},
	districtChildren: {type:String},
	localityChildren: {type:String},
	municipalityChildren: {type:String},
	departamentChildren: {type:String},
	levelhomeChildren: {type:Number},
	healthChildren: {type:String},
	epsChildren: {type:String},
	apbChildren: {type:String},
	glassesChildren: {type:Number},
	hearingaidChildren: {type:Number},
	abilityChildren: {type:String},
	debilityChildren: {type:String},
	statusChildren: {type:Number, default:0},
	observationChildren: {type:String, default:"Sin Observaciones..."},
	dateStart: {type:Date, default:Date.now},
	dateEnd: {type:Date, default:Date.now},
	idParent: [{idParent:{type:Mongoose.Schema.ObjectId, ref: "parent"}, relationshipParent:{type:Number}}]
})

/* Creacion de los Modelos de la DB*/
/*
	El nombre de la coleccion se pasa en singular, y mongoose la crea en plular en la DB
	Mongoose.model('singularName', schema)
*/
var Children = Mongoose.model("children", childrenSchema),
	models = {
		parent : require("./parent"),
		user : require("./user")
	}


childrenSchema.pre("save",function (next) {
	Children.findOne({idChildren : this.idChildren}, (err, children) => {
		if(children) next(new Error("¡Niñ@ ya existe!"))
		models.user.findOne({idUser : this.idChildren}, (err, user) => {
			if(user) next(new Error("Esta Identificacion Se encuenta Registrada!"))
			models.parent.findOne({idParent : this.idChildren}, (err, parent) => {
				if(parent) next(new Error("Esta Identificacion Se encuenta Registrada!"))
				else next()
			})
		})
	})
})

module.exports = Children