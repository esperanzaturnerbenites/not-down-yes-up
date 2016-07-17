var Mongoose = require("mongoose")

/* Definicion de Esquemas de la DB*/
const adminuserSchema = new Mongoose.Schema({
	userUser: {type:String},
	passUser: {type:String},
	typeUser: {type:Number},
	statusUser: {type:Number},
	dateUser: {type:Date, default:Date.now},
	idUser: {type:Mongoose.Schema.ObjectId, ref: "user"}
})

/* Creacion de los Modelos de la DB*/
/*
	El nombre de la coleccion se pasa en singular, y mongoose la crea en plular en la DB
	Mongoose.model('singularName', schema)
*/
var AdminUser = Mongoose.model("adminuser", adminuserSchema)

adminuserSchema.pre("save",function (next) {
	AdminUser.findOne({userUser : this.userUser}, (err, adminuser) => {
		if (adminuser) next(new Error("¡Usuario de logueo ya existe!"))
		else next()
	})
})

adminuserSchema.pre("remove",function (next) {
	AdminUser.findOne({userUser : "Developer"}, (err, user) => {
		if (user) next(new Error("Useradmin not delete"))
		else next()
	})
})

module.exports = AdminUser