//Requerir Mongoose
var Mongoose = require("mongoose"),
	Schema = Mongoose.Schema

//Crear Esquemas
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
		studyUser: {type:String},
		professionUser: {type:String},
		experienceUser: {type:Number},
		centerUser: {type:String}
	}),

	adminuserSchema = new Mongoose.Schema({
		userUser: {type:String},
		passUser: {type:String},
		typeUser: {type:String},
		dateUser: {type:Date, default:Date.now},
		idUser: {type:Schema.ObjectId, ref: "user"}
	}),

	childrenSchema = new Mongoose.Schema({
		idChildren: {type:Number, required:true},
		nameChildren: {type:String},
		lastnameChildren: {type:String},
		imgChildren: {type:String},
		birthdateChildren: {type:Date},
		birthplaceChildren: {type:String},
		ageChildren: {type:Number},
		genderChildren: {type:String},
		liveSon: {type:String},
		addressChildren: {type:String},
		districtChildren: {type:String},
		localityChildren: {type:String},
		departamentChildren: {type:String},
		levelhomeChildren: {type:String},
		healthChildren: {type:String},
		epsChildren: {type:String},
		apbChildren: {type:String},
		glassesChildren: {type:Number},
		hearingaidChildren: {type:Number},
		abilityChildren: {type:String},
		debilityChildren: {type:String},
		statusChildren: {type:String, default:"Registrado"},
		dateStart: {type:Date, default:Date.now},
		dateEnd: {type:Date, default:Date.now}
	}),

	parentSchema = new Mongoose.Schema({
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
		jobParent: {type:String},
		relationshipParent: {type:Number},
		idChildren: [{type:Schema.ObjectId, ref: "children"}]
	}),

	activityvalidSchema = new Mongoose.Schema({
		statusActivity: {type:String, default:"Pendiente"},
		scoreSystemActivity: {type:Number, default:0},
		scoreTeachActivity: {type:Number, default:0},
		backingMaxActivity:{type:Number, default:null},
		backingMinActivity:{type:Number, default:null},
		backingDFunctionActivity:{type:Number, default:null},
		observationActivity: {type:String, default:"Sin Validar"},
		date: {type:Date, default:Date.now},
		idActivity: {type:Schema.ObjectId, ref: "activity"},
		idStep: {type:Schema.ObjectId, ref: "step"},
		idUser: {type:Schema.ObjectId, ref: "user"},
		idChildren: {type:Schema.ObjectId, ref: "children"}
	}),

	activityhistorySchema = new Mongoose.Schema({
		statusActivity: {type:String, default:"Pendiente"},
		scoreSystemActivity: {type:Number, default:0},
		scoreTeachActivity: {type:Number, default:0},
		observationActivity: {type:String, default:"Sin Validar"},
		date: {type:Date, default:Date.now},
		idActivity: {type:Schema.ObjectId, ref: "activity"},
		idStep: {type:Schema.ObjectId, ref: "step"},
		idUser: {type:Schema.ObjectId, ref: "user"},
		idTeacher: {type:Schema.ObjectId, ref: "user"},
		idChildren: {type:Schema.ObjectId, ref: "children"}
	}),

	activitySchema = new Mongoose.Schema({
		activityActivity: {type:Number},
		nameActivity: {type:String},
		descriptionActivity: {type:String},
		guidesActivity: [],
		imgActActivity: {type:String},
		imgNumActivity: {type:String},
		audioActivity: {type:String},
		urlActivity: {type:String},
		styleActivity: {type:String},
		stepActivity: {type:Number}
	}),

	stepvalidSchema = new Mongoose.Schema({
		statusStep: {type:String, default:"Pendiente"},
		scoreStep: {type:Number, default:0},
		observationStep: {type:String, default:"Sin Validar"},
		date: {type:Date, default:Date.now},
		idStep: {type:Schema.ObjectId, ref: "step"},
		idUser: {type:Schema.ObjectId, ref: "user"},
		idChildren: {type:Schema.ObjectId, ref: "children"}
	}),

	stepSchema = new Mongoose.Schema({
		stepStep: {type:Number},
		nameStep: {type:String},
		descriptionStep: {type:String},
		imgStep: {type:String},
		styleStep: {type:String},
		urlStep: {type:String}
	})


var models = {
	user: Mongoose.model("user", userSchema),
	adminuser: Mongoose.model("adminuser", adminuserSchema),
	children: Mongoose.model("children", childrenSchema),
	parent: Mongoose.model("parent", parentSchema),
	activityvalid: Mongoose.model("activityvalid", activityvalidSchema),
	activityhistory: Mongoose.model("activityhistory", activityhistorySchema),
	stepvalid: Mongoose.model("stepvalid", stepvalidSchema),
	activity: Mongoose.model("activity", activitySchema),
	step: Mongoose.model("step", stepSchema)
}

userSchema.pre("save",(next) => {
	models.user.findOne({idUser : this.idUser}, (err, user) => {
		if(user) next(new Error("¡Usuario ya existe!"))
		else next()
	})
})

adminuserSchema.pre("save",(next) => {
	//console.log(this)
	models.adminuser.findOne({userUser : this.userUser}, (err, adminuser) => {
		if (adminuser) next(new Error("¡Usuario de logueo ya existe!"))
		else next()
	})
})

adminuserSchema.pre("remove",(next) => {
	models.adminuser.findOne({userUser : "Developer"}, (err, user) => {
		if (user) next(new Error("Useradmin not delete"))
		else next()
	})
})

childrenSchema.pre("save",(next) => {
	models.children.findOne({idChildren : this.idChildren}, (err, children) => {
		if (children) next(new Error("¡Niñ@ ya existe1"))
		else next()
	})
})

parentSchema.pre("save",(next) => {
	models.parent.findOne({idParent : this.idParent}, (err, parent) => {
		if (parent) next(new Error("¡Familiar ya existe!"))
		else next()
	})
})

module.exports = models