const CTE = { 
	INDICATORS: {
		L:1,
		LP:2,
		P:3
	},
	STATUS_CODE: {
		OK:0,
		NOT_OK:1,
		INFORMATION:2
	},
	YES_OR_NOT: {
		NO: 0,
		YES: 1
	},
	TYPE_USER: {
		ADMINISTRATOR: 0,
		TEACHER: 1,
		DEVELOPER: 2
	},
	STATUS_USER:{
		INACTIVE: 0,
		ACTIVE: 1
	},
	GENDER_CHILD:{
		GIRL: 0,
		BOY: 1
	},
	STATUS_ESTIMULATION:{
		REGISTER : 0,
		IN_PROGRESS : 1,
		QUALIFIED : 2,
		RETIRED : 3
	},
	LIVE_SON: {
		MOM:0,
		DAD:1,
		CARE:2
	},
	STATUS_ACTIVITY: {
		UNCOMPLETED:0,
		COMPLETED:1,
		UNVALIDATED:2
	},
	DEFAULT_TEACHER: {
		USERNAME:"defaultprofe"
	},
	DEFAULT_ADMINISTRATOR: {
		USERNAME:"defaultadmin"
	},
	FIRST_USER: {
		USERNAME:"Developer",
		PASSWORD: "Developer"
	},
	LEVEL_STUDY:{
		"BASIC_PRIMARY" :0,
		"BASIC_HIGH_SCHOOL" :1,
		"BACHELOR" :2,
		"PROFESSIONAL_TECHNICIAN" :3,
		"TECHNOLOGIST" :4,
		"PROFESSIONAL" :5,
		"SPECIALIZATION" :6,
		"MASTERS_DEGREE" :7,
		"DOCTORATE" :8
	},
	MIN_NUMBER_ACTIVITIES_HISTORIES_FOR_VALIDATE_ACTIVITY:3,
	BASE_PATH_LOG : "logs/",
	BASE_NAME_LOG : "log-year-month.log",
	MIN_SCORE_SYSTEM:5,
	MAX_SCORE_SYSTEM:10,
	FN: {
		STATUS_ESTIMULATION: {},
		STATUS_ACTIVITY: {},
		STATUS_CODE: {},
		TYPE_USER: {},
		STATUS_USER: {},
		GENDER_CHILD: {},
		LEVEL_STUDY: {},
		INDICATORS: {},
		LIVE_SON: {},
		YES_OR_NOT: {}
	}
}

CTE.FN.INDICATORS.getString = function(indicator){
	var indicatorString = ""
	if(indicator == CTE.INDICATORS.L){
		indicatorString = "L"
	}else if(indicator == CTE.INDICATORS.P){
		indicatorString = "P"
	}else if(indicator == CTE.INDICATORS.LP){
		indicatorString = "LP"
	}else{
		indicatorString = ""
	}
	return indicatorString
}

CTE.FN.STATUS_ACTIVITY.getString = function(status){
	var statusString = ""
	if(status == CTE.STATUS_ACTIVITY.UNCOMPLETED){
		statusString = "Sin Completar"
	}else if(status == CTE.STATUS_ACTIVITY.COMPLETED){
		statusString = "Completada"
	}else{
		statusString = "Sin Estado"
	}
	return statusString
}
CTE.FN.STATUS_ESTIMULATION.getString = function(status){
	var statusString = ""
	if(status == CTE.STATUS_ESTIMULATION.REGISTER){
		statusString = "Registrado"
	}else if(status == CTE.STATUS_ESTIMULATION.IN_PROGRESS){
		statusString = "En Cursos"
	}else if(status == CTE.STATUS_ESTIMULATION.QUALIFIED){
		statusString = "Calificado"
	}else if(status == CTE.STATUS_ESTIMULATION.RETIRED){
		statusString = "Retirado"
	}else{
		statusString = "Sin Estado"
	}
	return statusString
}

CTE.FN.STATUS_CODE.getString = function(status) {
	var statusString = ""
	if(status == CTE.STATUS_CODE.OK){
		statusString = "Correcto"
	}else if(status == CTE.STATUS_CODE.NOT_OK){
		statusString = "Incorrecto"
	}else if(status == CTE.STATUS_CODE.INFORMATION){
		statusString = "Advertencia"
	}else{
		statusString = "Sin Codigo de Estado"
	}
	return statusString
}

CTE.FN.TYPE_USER.getString = function(type) {
	var typeString = ""
	if(type == CTE.TYPE_USER.ADMINISTRATOR){
		typeString = "Administrador"
	}else if(type == CTE.TYPE_USER.TEACHER){
		typeString = "Docente"
	}else if(type == CTE.TYPE_USER.DEVELOPER){
		typeString = "Desarrollador"
	}else{
		typeString = "Sin Usuario"
	}
	return typeString
}

CTE.FN.STATUS_USER.getString = function(status) {
	var statusString = ""
	if(status == CTE.STATUS_USER.INACTIVE){
		statusString = "Inactivo"
	}else if(status == CTE.STATUS_USER.ACTIVE){
		statusString = "Activo"
	}else{
		statusString = "Sin Estado"
	}
	return statusString
}

CTE.FN.GENDER_CHILD.getString = function(gender) {
	var genderString = ""
	if(gender == CTE.GENDER_CHILD.GIRL){
		genderString = "Niña"
	}else if(gender == CTE.GENDER_CHILD.BOY){
		genderString = "Niño"
	}else{
		genderString = "Genero No Registrado"
	}
	return genderString
}

CTE.FN.LEVEL_STUDY.getString = function(level) {
	var levelStudyString = ""
	if(level == CTE.LEVEL_STUDY.BASIC_PRIMARY){
		levelStudyString = "Básica Primaria"
	}else if(level == CTE.LEVEL_STUDY.BASIC_HIGH_SCHOOL){
		levelStudyString = "Básica Secundaria"
	}else if(level == CTE.LEVEL_STUDY.BACHELOR){
		levelStudyString = "Bachiller"
	}else if(level == CTE.LEVEL_STUDY.PROFESSIONAL_TECHNICIAN){
		levelStudyString = "Técnico Profesional"
	}else if(level == CTE.LEVEL_STUDY.TECHNOLOGIST){
		levelStudyString = "Tecnólogo"
	}else if(level == CTE.LEVEL_STUDY.PROFESSIONAL){
		levelStudyString = "Profesional"
	}else if(level == CTE.LEVEL_STUDY.SPECIALIZATION){
		levelStudyString = "Especialización"
	}else if(level == CTE.LEVEL_STUDY.MASTERS_DEGREE){
		levelStudyString = "Maestría"
	}else if(level == CTE.LEVEL_STUDY.DOCTORATE){
		levelStudyString = "Doctorado"
	}else{
		levelStudyString = "Sin Nivel"
	}
	return levelStudyString
}

CTE.FN.LIVE_SON.getString = function(level) {
	var levelString = ""
	if(level == CTE.LIVE_SON.MOM){
		levelString = "Mamá"
	}else if(level == CTE.LIVE_SON.DAD){
		levelString = "Papá"
	}else if(level == CTE.LIVE_SON.CARE){
		levelString = "Cuidador"
	}else{
		levelString = "Cuidador No Registrador"
	}
	return levelString
}

CTE.FN.YES_OR_NOT.getString = function(boolean) {
	var levelString = ""
	if(boolean == CTE.YES_OR_NOT.NO){
		levelString = "No"
	}else if(boolean == CTE.YES_OR_NOT.YES){
		levelString = "Si"
	}else{
		levelString = "No Registrador"
	}
	return levelString
}

module.exports = CTE