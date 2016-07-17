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
		studyUser: {type:Number},
		professionUser: {type:String},
		experienceUser: {type:Number},
		centerUser: {type:String}
	}),

	adminuserSchema = new Mongoose.Schema({
		userUser: {type:String},
		passUser: {type:String},
		typeUser: {type:Number},
		statusUser: {type:Number},
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
		idParent: [{idParent:{type:Schema.ObjectId, ref: "parent"}, relationshipParent:{type:Number}}]
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
		jobParent: {type:String}
	//	relationshipParent: [{type:Number}],
	//	idChildren: [{type:Schema.ObjectId, ref: "children"}]
	}),

	activityvalidSchema = new Mongoose.Schema({
		statusActivity: {type:Number, default:0},
		scoreSystemActivity: {type:Number, default:0},
		scoreTeachActivity: {type:Number, default:0},
		backingMaxActivity:{type:Number, default:null},
		backingMinActivity:{type:Number, default:null},
		backingDFunctionActivity:{type:Number, default:null},
		observationActivity: {type:String, default:"Sin Calificar"},
		date: {type:Date, default:Date.now},
		idActivity: {type:Schema.ObjectId, ref: "activity"},
		idStep: {type:Schema.ObjectId, ref: "step"},
		idUser: {type:Schema.ObjectId, ref: "adminuser"},
		idChildren: {type:Schema.ObjectId, ref: "children"}
	}),

	activityhistorySchema = new Mongoose.Schema({
		statusActivity: {type:Number, default:0},
		scoreSystemActivity: {type:Number, default:0},
		scoreTeachActivity: {type:Number, default:0},
		observationActivity: {type:String, default:"Sin Calificar"},
		date: {type:Date, default:Date.now},
		idActivity: {type:Schema.ObjectId, ref: "activity"},
		idStep: {type:Schema.ObjectId, ref: "step"},
		idUser: {type:Schema.ObjectId, ref: "adminuser"},
		idChildren: {type:Schema.ObjectId, ref: "children"}
	}),

	activitySchema = new Mongoose.Schema({
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
	}),

	stepvalidSchema = new Mongoose.Schema({
		statusStep: {type:Number, default:0},
		scoreStep: {type:Number, default:0},
		observationStep: {type:String, default:"Sin Calificar"},
		date: {type:Date, default:Date.now},
		idStep: {type:Schema.ObjectId, ref: "step", required:true},
		idUser: {type:Schema.ObjectId, ref: "adminuser", required:true},
		idChildren: {type:Schema.ObjectId, ref: "children", required:true}
	}),

	stepSchema = new Mongoose.Schema({
		stepStep: {type:Number},
		nameStep: {type:String},
		descriptionStep: {type:String},
		urlStep: {type:String}
	})


const models = {
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

childrenSchema.pre("save",function (next) {
	models.children.findOne({idChildren : this.idChildren}, (err, children) => {
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

parentSchema.pre("save",function (next) {
	models.parent.findOne({idParent : this.idParent}, (err, parent) => {
		if(parent) next(new Error("¡Familiar ya existe!"))
		models.user.findOne({idUser : this.idParent}, (err, user) => {
			if(user) next(new Error("Esta Identificacion Se encuenta Registrada!"))
			models.children.findOne({idChildren : this.idParent}, (err, children) => {
				if(children) next(new Error("Esta Identificacion Se encuenta Registrada!"))
				else next()
			})
		})
	})
})

userSchema.pre("save",function (next) {
	models.user.findOne({idUser : this.idUser}, (err, user) => {
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

adminuserSchema.pre("save",function (next) {
	models.adminuser.findOne({userUser : this.userUser}, (err, adminuser) => {
		if (adminuser) next(new Error("¡Usuario de logueo ya existe!"))
		else next()
	})
})

adminuserSchema.pre("remove",function (next) {
	models.adminuser.findOne({userUser : "Developer"}, (err, user) => {
		if (user) next(new Error("Useradmin not delete"))
		else next()
	})
})

childrenSchema.post("remove",function (children) {
	console.log(children)
	var idParents = children.idParent.map(objParent =>{
		return objParent.idParent.idParent
	})
	models.children.find({'idParent.idParent' : {$in : idParents}})
	.populate('idParent.idParent')
	.exec((err, childrenFind) => {
		if(!childrenFind){
			var queryParents = childrenFind.idParent.map(objParent =>{
				return {idParent : objParent.idParent.idParent}
			})

			models.parent.remove({$or:queryParents})
		}
	})
})


module.exports = models