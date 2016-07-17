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
	STATUS_CHILDREN:{
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
module.exports = CTE