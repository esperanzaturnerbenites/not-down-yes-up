const CTE = {
	STATUS_CODE: {
		OK:0,
		NOT_OK:1,
		INFORMATION:2
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
	STATUS_ACTIVITY:{
		REGISTER : 0,
		IN_PROGRESS : 1,
		QUALIFIED : 2,
		RETIRED : 3
	},
	FIRST_USER: {
		USERNAME:"Developer",
		PASSWORD: "Developer"
	},
	BASE_PATH_LOG : "logs/",
	BASE_NAME_LOG : "log-year-month.log"
}

CTE.STATUS_ACTIVITY.getString = function(status){
	var statusString = ""
	if(status == CTE.STATUS_ACTIVITY.REGISTER){
		statusString = "Registrado"
	}else if(status == CTE.STATUS_ACTIVITY.IN_PROGRESS){
		statusString = "En Cursos"
	}else if(status == CTE.STATUS_ACTIVITY.QUALIFIED){
		statusString = "Calificado"
	}else if(status == CTE.STATUS_ACTIVITY.RETIRED){
		statusString = "Retirado"
	}else{
		statusString = "Sin Estado"
	}
	return statusString
}

CTE.STATUS_CODE.getString = function(status) {
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

CTE.TYPE_USER.getString = function(type) {
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

CTE.STATUS_USER.getString = function(status) {
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

module.exports = CTE