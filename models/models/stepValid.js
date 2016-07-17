var Mongoose = require("mongoose")

/* Definicion de Esquemas de la DB*/
const stepvalidSchema = new Mongoose.Schema({
	statusStep: {type:Number, default:0},
	scoreStep: {type:Number, default:0},
	observationStep: {type:String, default:"Sin Calificar"},
	date: {type:Date, default:Date.now},
	idStep: {type:Mongoose.Schema.ObjectId, ref: "step", required:true},
	idUser: {type:Mongoose.Schema.ObjectId, ref: "adminuser", required:true},
	idChildren: {type:Mongoose.Schema.ObjectId, ref: "children", required:true}
})

/* Creacion de los Modelos de la DB*/
/*
	El nombre de la coleccion se pasa en singular, y mongoose la crea en plular en la DB
	Mongoose.model('singularName', schema)
*/
var StepValid = Mongoose.model("stepvalid", stepvalidSchema)

module.exports = StepValid