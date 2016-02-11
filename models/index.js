//Requerir Mongoose
var Mongoose = require('mongoose')

//Crear Esquemas
const userSchema = new Mongoose.Schema({
	userId: {type:Number , required:true, unique:true},
	userExpedition: {type:String, text:true, default:""},
	userName: {type:String, text:true , default:""},
	userLastname : {type:String, text:true , default:""},
	userAge: {type:Number,  default:0},
	userImg: {type:String, text:true , default:""},
	userTel: {type:Number, default:0},
	userCel: {type:Number, default:0},
	userEmail: {type:String, text:true , default:""},
	userAddress: {type:String, text:true , default:""},
	userLocality: {type:String, text:true , default:""},
	userMunicipality: {type:String, text:true , default:""},
	userDepartament: {type:String, text:true , default:""},
	userStudy: {type:String, text:true , default:""},
	userProfession: {type:String, text:true , default:""},
	userExperience: {type:String, text:true , default:""},
	userCenter: {type:String, text:true , default:""}
}),

momSchema = new Mongoose.Schema({
	momId: {type:Number , required:true, unique:true},
	momExpedition : {type:String, text:true, default:""},
	momName: {type:String, text:true , default:""},
	momLastname: {type:String, text:true , default:""},
	momBirthdate: {type:Date},
	momImg: {type:String, text:true , default:""},
	momTel: {type:Number, default:0},
	momCel: {type:Number, default:0},
	momEmail: {type:String, text:true , default:""},
	momAddress: {type:String, text:true , default:""},
	momLocality: {type:String, text:true , default:""},
	momMunicipality: {type:String, text:true , default:""},
	momDepartament: {type:String, text:true , default:""},
	momStudy: {type:String, text:true , default:""},
	momProfession: {type:String, text:true , default:""},
	momJob: {type:String, text:true , default:""}
}),

dadSchema = new Mongoose.Schema({
	dadId: {type:Number , required:true, unique:true},
	dadExpedition : {type:String, text:true, default:""},
	dadName: {type:String, text:true , default:""},
	dadLastname: {type:String, text:true , default:""},
	dadBirthdate: {type:Date},
	dadImg: {type:String, text:true , default:""},
	dadTel: {type:Number, default:0},
	dadCel: {type:Number, default:0},
	dadEmail: {type:String, text:true , default:""},
	dadAddress: {type:String, text:true , default:""},
	dadLocality: {type:String, text:true , default:""},
	dadMunicipality: {type:String, text:true , default:""},
	dadDepartament: {type:String, text:true , default:""},
	dadStudy: {type:String, text:true , default:""},
	dadProfession: {type:String, text:true , default:""},
	dadJob: {type:String, text:true , default:""}
}),

careSchema = new Mongoose.Schema({
	careId: {type:Number , required:true, unique:true},
	careExpedition : {type:String, text:true, default:""},
	careName: {type:String, text:true , default:""},
	careLastname: {type:String, text:true , default:""},
	careBirthdate: {type:Date},
	careImg: {type:String, text:true , default:""},
	careTel: {type:Number, default:0},
	careCel: {type:Number, default:0},
	careEmail: {type:String, text:true , default:""},
	careAddress: {type:String, text:true , default:""},
	careLocality: {type:String, text:true , default:""},
	careMunicipality: {type:String, text:true , default:""},
	careDepartament: {type:String, text:true , default:""},
	careStudy: {type:String, text:true , default:""},
	careProfession: {type:String, text:true , default:""},
	careJob: {type:String, text:true , default:""}
}),

childrenSchema = new Mongoose.Schema({
	childrenId: {type:Number , required:true, unique:true},
	childrenName: {type:String, text:true , default:""},
	childrenLastname: {type:String, text:true , default:""},
	childrenBirthdate: {type:Date},
	childrenBirthplace: {type:String, text:true , default:""},
	childrenImg: {type:String, text:true , default:""},
	childrenGender: {type:String, text:true , default:""},
	childrenLiveMom: {type:String, text:true , default:""},
	childrenLiveDad: {type:String, text:true , default:""},
	childrenStatus: {type:String, text:true , default:""},
	childrenDateStart: {type:String, text:true , default:""},
	childrenDateEnd: {type:String, text:true , default:""},
	childrenMunicipality: {type:String, text:true , default:""},
	childrenDepartament: {type:String, text:true , default:""},
	childrenStudy: {type:String, text:true , default:""},
	childrenProfession: {type:String, text:true , default:""},
	childrenJob: {type:String, text:true , default:""}
}),

adminUsersSchema = new Mongoose.Schema({
	adminUsersType: {type:String, text:true , default:""},
	adminUsersUser: {type:String, text:true , default:""},
	adminUsersPassword: {type:String, text:true , default:""},
}),

stepSchema = new Mongoose.Schema({
	stepNumber: {type:String, text:true , default:""},
	stepDescription: {type:String, text:true , default:""},
	stepScore: {type:Number, default:0},
	stepStatus: {type:String, text:true , default:""},
	stepDate: {type:Date},
}),

activitySchema = new Mongoose.Schema({
	activityName: {type:String, text:true , default:""},
	activityDescription: {type:String, text:true , default:""},
	activityScore: {type:Number, default:0},
	activityObservation: {type:String, text:true , default:""},
	activityStatus: {type:String, text:true , default:""},
	activityDate: {type:Date},
})


module.exports = {
	user : Mongoose.model('user', userSchema),
	mom : Mongoose.model('mom', momSchema),
	dad : Mongoose.model('dad', dadSchema),
	care : Mongoose.model('care', careSchema),
	children : Mongoose.model('children', childrenSchema),
	adminUsers : Mongoose.model('adminUser', adminUsersSchema),
	step : Mongoose.model('step', stepSchema),
	activity : Mongoose.model('activity', activitySchema)
      
};