var Mongoose = require("mongoose")

/* Definicion de Esquemas de la DB*/
const stepSchema = new Mongoose.Schema({
	stepStep: {type:Number},
	nameStep: {type:String},
	descriptionStep: {type:String},
	urlStep: {type:String}
})

/* Creacion de los Modelos de la DB*/
/*
	El nombre de la coleccion se pasa en singular, y mongoose la crea en plular en la DB
	Mongoose.model('singularName', schema)
*/
var Step = Mongoose.model("step", stepSchema)

module.exports = Step