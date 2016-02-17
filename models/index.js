//Requerir Mongoose
var Mongoose = require('mongoose')

//Crear Esquemas
const userSchema = new Mongoose.Schema({
	idUser: {type:Number, required:true},
	expeditionUser: {type:String, default:""},
	nameUser: {type:String, default:""},
	lastnameUser : {type:String, default:""},
	ageUser: {type:Number,  default:0},
	imgUser: {type:String, default:""},
	telUser: {type:Number, default:0},
	celUser: {type:Number, default:0},
	emailUser: {type:String, default:""},
	addressUser: {type:String, default:""},
	localityUser: {type:String, default:""},
	municipalityUser: {type:String, default:""},
	departamentUser: {type:String, default:""},
	studyUser: {type:String, default:""},
	professionUser: {type:String, default:""},
	experienceUser: {type:Number, default:0},
	centerUser: {type:String, default:""}
}),

momSchema = new Mongoose.Schema({
	idMom: {type:Number, required:true},
	idExpeditionMom: {type:String, default:""},
	nameMom: {type:String, default:""},
	lastnameMom: {type:String, default:""},
	birthdateMom: {type:Date, default:Date.now},
	imgMom: {type:String, default:""},
	telMom: {type:Number, default:0},
	celMom: {type:Number, default:0},
	emailMom: {type:String, default:""},
	addressMom: {type:String, default:""},
	localityMom: {type:String, default:""},
	municipalityMom: {type:String, default:""},
	departamentMom: {type:String, default:""},
	studyMom: {type:String, default:""},
	professionMom: {type:String, default:""},
	jobMom: {type:String, default:""},
	idChildren: {type:Number}
}),

dadSchema = new Mongoose.Schema({
	idDad: {type:Number, required:true},
	idExpeditionDad : {type:String, default:""},
	nameDad: {type:String, default:""},
	lastnameDad: {type:String, default:""},
	birthdateDad: {type:Date, default:Date.now},
	imgDad: {type:String, default:""},
	telDad: {type:Number, default:0},
	celDad: {type:Number, default:0},
	emailDad: {type:String, default:""},
	addressDad: {type:String, default:""},
	localityDad: {type:String, default:""},
	municipalityDad: {type:String, default:""},
	departamentDad: {type:String, default:""},
	studyDad: {type:String, default:""},
	professionDad: {type:String, default:""},
	jobDad: {type:String, default:""},
	idChildren: {type:Number}
}),

careSchema = new Mongoose.Schema({
	idCare: {type:Number, required:true},
	idExpeditionCare : {type:String, default:""},
	nameCare: {type:String, default:""},
	lastnameCare: {type:String, default:""},
	birthdateCare: {type:Date, default:Date.now},
	relationshipCare: {type:String, default:""},
	imgCare: {type:String, default:""},
	telCare: {type:Number, default:0},
	celCare: {type:Number, default:0},
	emailCare: {type:String, default:""},
	addressCare: {type:String, default:""},
	localityCare: {type:String, default:""},
	municipalityCare: {type:String, default:""},
	departamentCare: {type:String, default:""},
	studyCare: {type:String, default:""},
	professionCare: {type:String, default:""},
	jobCare: {type:String, default:""},
	idChildren: {type:Number}
}),

childrenSchema = new Mongoose.Schema({
	idChildren: {type:Number, required:true},
	nameChildren: {type:String, default:""},
	lastnameChildren: {type:String, default:""},
	imgChildren: {type:String, default:""},
	birthdateChildren: {type:Date, default:Date.now},
	birthplaceChildren: {type:String, default:""},
	ageChildren: {type:Number, default:0},
	genderChildren: {type:String, default:""},
	liveSon: {type:String, default:""},
	statusChildren: {type:String, default:"Registrado"},
	dateStart: {type:Date, default:Date.now},
	dateEnd: {type:Date, default:Date.now}
}),

adminuserSchema = new Mongoose.Schema({
	userUser: {type:String, default:""},
	passUser: {type:String, default:""},
	typeUser: {type:String, default:""},
	dateUser: {type:Date, default:Date.now},
	idUser: {type:Number}
}),

activityhistorySchema = new Mongoose.Schema({
	Activity: {type:String, default:"Validado"},
	scoreActivity: {type:Number, default:0},
	observationActivity: {type:String, default:"Validado"},
	step: {type:String, default:""},
	statusStep: {type:String, default:"Pendiente"},
	scoreStep: {type:Number, default:0},
	observationStep: {type:String, default:"Pendiente"},
	dateActivity: {type:Date, default:Date.now},
	idUser: {type:Number},
	idChildren: {type:Number}
})

module.exports = {
	user : Mongoose.model('user', userSchema),
	mom : Mongoose.model('mom', momSchema),
	dad : Mongoose.model('dad', dadSchema),
	care : Mongoose.model('care', careSchema),
	children : Mongoose.model('children', childrenSchema),
	adminuser : Mongoose.model('adminUser', adminuserSchema),
	activityhistory : Mongoose.model('activityhistory', activityhistorySchema)
};