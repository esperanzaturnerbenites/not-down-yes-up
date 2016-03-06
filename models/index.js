//Requerir Mongoose
var Mongoose = require('mongoose'),
Schema = Mongoose.Schema

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
	districtUser: {type:String, default:""},
	localityUser: {type:String, default:""},
	departamentUser: {type:String, default:""},
	studyUser: {type:String, default:""},
	professionUser: {type:String, default:""},
	experienceUser: {type:Number, default:0},
	centerUser: {type:String, default:""}
}),

adminuserSchema = new Mongoose.Schema({
	userUser: {type:String, default:""},
	passUser: {type:String, default:""},
	typeUser: {type:String, default:""},
	dateUser: {type:Date, default:Date.now},
	idUser: {type:Schema.Types.ObjectId, ref: "user"}
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
	addressChildren: {type:String, default:""},
	districtChildren: {type:String, default:""},
	localityChildren: {type:String, default:""},
	departamentChildren: {type:String, default:""},
	levelhomeChildren: {type:String, default:""},
	healthChildren: {type:String, default:""},
	epsChildren: {type:String, default:""},
	apbChildren: {type:String, default:""},
	glassesChildren: {type:Number, default:""},
	hearingaidChildren: {type:Number, default:""},
	abilityChildren: {type:String, default:""},
	debilityChildren: {type:String, default:""},
	statusChildren: {type:String, default:"Registrado"},
	dateStart: {type:Date, default:Date.now},
	dateEnd: {type:Date, default:Date.now}
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
	studyMom: {type:String, default:""},
	professionMom: {type:String, default:""},
	jobMom: {type:String, default:""},
	idChildren: {type:Schema.Types.ObjectId, ref: "children"}
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
	studyDad: {type:String, default:""},
	professionDad: {type:String, default:""},
	jobDad: {type:String, default:""},
	idChildren: {type:Schema.Types.ObjectId, ref: "children"}
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
	studyCare: {type:String, default:""},
	professionCare: {type:String, default:""},
	jobCare: {type:String, default:""},
	idChildren: {type:Schema.Types.ObjectId, ref: "children"}
}),

activityhistorySchema = new Mongoose.Schema({
	statusActivity: {type:String, default:"Pendiente"},
	scoreSystemActivity: {type:Number, default:0},
	scoreTeachActivity: {type:Number, default:0},
	backingMaxActivity:{type:Number, default:0},
	backingMinActivity:{type:Number, default:0},
	backingDFunctionActivity:{type:Number, default:0},
	observationActivity: {type:String, default:"Validado"},
	date: {type:Date, default:Date.now},
	idActivity: {type:Schema.Types.ObjectId, ref: "activity"},
	idUser: {type:Schema.Types.ObjectId, ref: "user"},
	idChildren: {type:Schema.Types.ObjectId, ref: "children"}
}),

stephistorySchema = new Mongoose.Schema({
	statusStep: {type:String, default:"Pendiente"},
	scoreStep: {type:Number, default:0},//**********Calcular solo cuando se valide la etapa.
	observationStep: {type:String, default:"Sin Validar"},
	date: {type:Date, default:Date.now},
	idStep: {type:Schema.Types.ObjectId, ref: "step"},
	idUser: {type:Schema.Types.ObjectId, ref: "user"},
	idChildren: {type:Schema.Types.ObjectId, ref: "children"}
}),

activitySchema = new Mongoose.Schema({
	activity: {type:Number},
	name: {type:String, default:""},
	description: {type:String, default:""},
	guides: [],
	img: {type:String, default:""},
	audio: {type:String, default:""},
	url: {type:String, default:""},
	step: {type:Number}
}),

stepSchema = new Mongoose.Schema({
	step: {type:Number},
	name: {type:String, default:""},
	description: {type:String, default:""}
})

module.exports = {
	user: Mongoose.model('user', userSchema),
	adminuser: Mongoose.model('adminuser', adminuserSchema),
	children: Mongoose.model('children', childrenSchema),
	mom: Mongoose.model('mom', momSchema),
	dad: Mongoose.model('dad', dadSchema),
	care: Mongoose.model('care', careSchema),
	activityhistory: Mongoose.model('activityhistory', activityhistorySchema),
	stephistory: Mongoose.model('stephistory', stephistorySchema),
	activity: Mongoose.model('activity', activitySchema),
	step: Mongoose.model('step', stepSchema)
};