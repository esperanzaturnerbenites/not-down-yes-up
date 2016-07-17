var Mongoose = require("mongoose")

/* Definicion de Esquemas de la DB*/
const activitySchema = new Mongoose.Schema({
	activityActivity: {type:Number},
	nameActivity: {type:String},
	descriptionActivity: {type:String},
	guidesActivity: [],
	guidesChildActivity: [],
	imgActivity: [],
	imgActivityIncorrect: [],
	imgDescriptionActivity: [],
	imgDescriptionIncorrectActivity: [],
	uniqueImageActivity: {type:String},
	onlyTextActivity: {type:String},
	scriptActivity: {type:String},
	audioActivity: [],
	urlActivity: {type:String},
	stepActivity: {type:Number}
})

/* Creacion de los Modelos de la DB*/
/*
	El nombre de la coleccion se pasa en singular, y mongoose la crea en plular en la DB
	Mongoose.model('singularName', schema)
*/
var Activity = Mongoose.model("activity", activitySchema)

module.exports = Activity