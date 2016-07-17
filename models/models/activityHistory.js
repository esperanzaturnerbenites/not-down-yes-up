var Mongoose = require("mongoose")

/* Definicion de Esquemas de la DB*/
const activityhistorySchema = new Mongoose.Schema({
	statusActivity: {type:Number, default:0},
	scoreSystemActivity: {type:Number, default:0},
	scoreTeachActivity: {type:Number, default:0},
	observationActivity: {type:String, default:"Sin Calificar"},
	date: {type:Date, default:Date.now},
	idActivity: {type:Mongoose.Schema.ObjectId, ref: "activity"},
	idStep: {type:Mongoose.Schema.ObjectId, ref: "step"},
	idUser: {type:Mongoose.Schema.ObjectId, ref: "adminuser"},
	idChildren: {type:Mongoose.Schema.ObjectId, ref: "children"}
})

/* Creacion de los Modelos de la DB*/
/*
	El nombre de la coleccion se pasa en singular, y mongoose la crea en plular en la DB
	Mongoose.model('singularName', schema)
*/
var ActivityHistory = Mongoose.model("activityhistory", activityhistorySchema)

module.exports = ActivityHistory