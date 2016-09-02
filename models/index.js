//Requerir Mongoose
var Mongoose = require("mongoose"),
	Schema = Mongoose.Schema,
	CTE = require("../CTE"),
	Q = require("q")

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
		municipalityUser: {type:String},
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
		untouchableUser: {type:Boolean,default:false},
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
		statusChildrenEstimulation: {type:Number, default:0},
		statusChildren: {type:Number, default:1},
		observationChildren: [{
			date:{type:Date, default:Date.now},
			observation: {type:String, default:"Registro Inicial"},
			status:{type:Number, default:CTE.STATUS_USER.ACTIVE}
		}],
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
		imgReviewActivity: [],
		imgActivityIncorrect: [],
		imgDescriptionActivity: [],
		imgReviewDescriptionActivity: [],
		imgDescriptionIncorrectActivity: [],
		uniqueImageActivity: {type:String},
		onlyTextActivity: {type:String},
		scriptActivity: {type:String},
		audioActivity: [],
		stepActivity: {type:Number}
	}),

	stepvalidSchema = new Mongoose.Schema({
		statusStep: {type:Number, default:CTE.STATUS_ACTIVITY.UNVALIDATED},
		scoreStep: {type:Number, default:0},
		observationStep: {type:String, default:"Sin Calificar"},
		date: {type:Date, default:Date.now},
		idStep: {type:Schema.ObjectId, ref: "step", required:true},
		idUser: {type:Schema.ObjectId, ref: "adminuser", required:true},
		idChildren: {type:Schema.ObjectId, ref: "children", required:true}
	}),

	stepSchema = new Mongoose.Schema({
		stepStep: {type:Number, required:[true,"El valor de 'stepStep' es requerido."]},
		nameStep: {type:String, required:[true,"El valor de 'nameStep' es requerido."]},
		descriptionStep: {type:String, required:[true,"El valor de 'descriptionStep' es requerido."]}
	})

activitySchema.method("getHistory", function (children,step){
	var activity = this
	return new Promise((resolve, reject) => {
		models.activityvalid.findOne({idChildren:children._id,idStep:step._id,idActivity:activity._id})
		.populate("idChildren idUser idStep idActivity")
		.exec(function(err,activitiesValidDB){

			models.activityhistory.find({idChildren:children._id,idStep:step._id,idActivity:activity._id})
			.populate("idChildren idUser idStep idActivity")
			.exec(function(err,activitiesHistoryDB){
				resolve({activitiesValid:activitiesValidDB,activitiesHistory:activitiesHistoryDB})
			})
		})
	})
})

/*
{
	"children": {},
	"stepsValid": [
		{
			"idStep": {},
			"idUser": {},
			"idChildren": {},
			"activities": [
				{
					"activitiesValid": [],
					"activitiesHistory": []
				}
			]
		}
	]
}
*/
childrenSchema.method("getDataAll", function (options){
	options = options ? options : {}

	var children = this,
		dataReturn = {}

	var filterSteps = false,
		filterActivities = false

	if(options.filters){
		filterSteps = options.filters.steps ? options.filters.steps: false,
		filterActivities = options.filters.activities ? options.filters.activities: false
	}

	return new Promise((resolvep1, rejectp1) => {
		models.children.findOne({idChildren:children.idChildren})
		.populate("idParent.idParent")
		.exec(function(err,childrenDB){
			dataReturn.children = childrenDB

			models.stepvalid.find({idChildren:childrenDB._id})
			.lean()
			.populate("idChildren idUser")
			.populate({path: 'idStep', options: { sort: { 'stepStep': 1 } } })
			//.sort({"idStep.stepStep":1})
			.exec(function(err,stepsValidDB){
				if(!stepsValidDB.length) return rejectp1({message:"No hay Etapas Validadas"})

				dataReturn.stepsValid = []

				var promisesStep = []
				var promisesActivities = []

				stepsValidDB.forEach(stepValidDB => {
					var promiseStep = new Promise((resolvep2, rejectp2) => {

						stepValidDB.activities = []
						models.activity.find({stepActivity:stepValidDB.idStep.stepStep})
						.sort({activityActivity:-1})
						.exec(function(err,activitiesDB){

							activitiesDB.forEach(activityDB => {
								var promiseActivity = activityDB.getHistory(children,stepValidDB.idStep)
								.then(data => {
									var writableActivity = activityDB.toJSON()

									writableActivity.activitiesValid = data.activitiesValid
									writableActivity.activitiesHistory = data.activitiesHistory

									stepValidDB.activities.push(writableActivity)
								})
								promisesActivities.push(promiseActivity)
							})
							dataReturn.stepsValid.push(stepValidDB)
							Q.all(promisesActivities).then(data => {
								resolvep2({})
							})
						})
					})
					promisesStep.push(promiseStep)
				})
				Q.all(promisesStep).then(data => {
					if(filterSteps) dataReturn.stepsValid = dataReturn.stepsValid.filter(e => {return filterSteps.indexOf(e.idStep.stepStep) >= 0})
					if(filterActivities) dataReturn.stepsValid.forEach(sv => {sv.activities = sv.activities.filter(e => {return filterActivities.indexOf(e.activityActivity) >= 0})})
					resolvep1(dataReturn)
				})
			})
		})
	})
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
		models.adminuser.findOne({idUser : this.idUser,typeUser:this.typeUser}, (err, adminuser) => {
			if (adminuser) next(new Error("El usuario Ya tiene un usuari ode este tipo"))
			else next()
		})
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