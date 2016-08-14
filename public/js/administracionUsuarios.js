/* Falta Refactorizar */ 
$("#formFindAll").submit(function(event){
	var data = {}

	if($("#typeConsult").val() == "T" && $("#typeConsulStatusUser").val() == "T"){
		/*Todos-Todos*/
		data.query = {typeUser : {$ne: CTE.TYPE_USER.DEVELOPER}}
	}else if($("#typeConsult").val() == "T" && $("#typeConsulStatusUser").val() == "Inactivo"){
		/*Todos-Inactivo*/
		data.query = {statusUser : CTE.STATUS_USER.INACTIVE, typeUser : {$ne: CTE.TYPE_USER.DEVELOPER}}
	}else if($("#typeConsult").val() == "T" && $("#typeConsulStatusUser").val() == "Activo"){
		/*Todos-Activos*/
		data.query = {statusUser :CTE.STATUS_USER.ACTIVE, typeUser : {$ne: CTE.TYPE_USER.DEVELOPER}}
	}else if($("#typeConsult").val() == "Docente" && $("#typeConsulStatusUser").val() == "T"){
		/*Todos-Docentes*/
		data.query = {typeUser : CTE.TYPE_USER.TEACHER}
	}else if($("#typeConsult").val() == "Docente" && $("#typeConsulStatusUser").val() == "Inactivo"){
		/*Inactivo-Docentes*/
		data.query = {typeUser : CTE.TYPE_USER.TEACHER, statusUser : CTE.STATUS_USER.INACTIVE}
	}else if($("#typeConsult").val() == "Docente" && $("#typeConsulStatusUser").val() == "Activo"){
		/*Activo-Docentes*/
		data.query = {typeUser : CTE.TYPE_USER.TEACHER, statusUser : CTE.STATUS_USER.ACTIVE}
	}else if($("#typeConsult").val() == "Administrador" && $("#typeConsulStatusUser").val() == "T"){
		/*Todos-Administradores*/
		data.query = {typeUser : CTE.TYPE_USER.ADMINISTRATOR}
	}else if($("#typeConsult").val() == "Administrador" && $("#typeConsulStatusUser").val() == "Inactivo"){
		/*Inactivo-Administradores*/
		data.query = {typeUser : CTE.TYPE_USER.ADMINISTRATOR, statusUser : CTE.STATUS_USER.INACTIVE}
	}else if($("#typeConsult").val() == "Administrador" && $("#typeConsulStatusUser").val() == "Activo"){
		/*Activo-Administradores*/
		data.query = {typeUser : CTE.TYPE_USER.ADMINISTRATOR, statusUser : CTE.STATUS_USER.ACTIVE}
	}

	data.fn = "renderListUser"
	data.params = {
		view: "views/reports/listUsers.jade",
		query: data.query
	}

	event.preventDefault()
	$.ajax({
		url: "/api/adminuser",
		contentType: "application/json", 
		type : "POST",
		data : JSON.stringify(data),
		success: showReportResult
	})
})

/* Falta Refactorizar */
$("#formNewUser").submit(function(event){
	event.preventDefault()

	if($("#passUser").val() == $("#newPassConfirmUser").val()){
		if(confirm("Se creará nuevo usuario de autenticación. ¿Desea continuar?")){
			$.ajax({
				url: "/api/new/adminuser",
				contentType : "application/json", 
				data : JSON.stringify({
					info:{
						"idUser": $("#idUser").val(),
						"userUser": $("#userUser").val(),
						"typeUser": $("#typeUser").val(),
						"passUser": $("#passUser").val(),
						"statusUser" : CTE.STATUS_USER.ACTIVE
					},
					fn:"checkNewAdminUser",
					params:{
						"idUser": $("#idUser").val(),
						"userUser": $("#userUser").val(),
						"typeUser": $("#typeUser").val()
					}
				}),
				type : "POST",
				success: function(response){
					if (response.err) return notification.show({msg:response.err.message, type:1})
					$("#formNewUser").trigger("reset")
					notification.show({msg:"El Usuario se creo correctamente", type:CTE.STATUS_CODE.OK})
				}
			})
		}
	}else notification.show({msg:"¡Contraseña no coincide!", type:CTE.STATUS_CODE.NOT_OK})
})

$("#formUpdatePass").submit(function(event){ 
	event.preventDefault()
	if($("#adminPassUser").val() == $("#adminPassConfirmUser").val()){
		if(confirm("Se actualizará contraseña a: " + $("#adminIdUser").val() +". ¿Desea continuar?")){
			$.ajax({
				url: "/api/adminuser",
				contentType: "application/json",
				data: JSON.stringify({
					data:{$set:{passUser:$("#adminPassUser").val()}},
					query:{userUser:$("#adminIdUser").val(),typeUser:{ $ne: 2 }},
					fn: "encryptPass",
					params :{passUser:$("#adminPassUser").val()}
				}),
				type: "PUT",
				success: function(response){
					$("#formUpdatePass").trigger("reset")
					notification.show({msg:response.message, type:response.statusCode})
				}
			})
		}
	}else{
		notification.show({msg:"¡Contraseña no coincide!", type:CTE.STATUS_CODE.NOT_OK})
	}
})

$("#formOpeUserRol").submit(function(event){
	event.preventDefault()
	if(confirm("Se actualizará rol a: " + $("#adminRolIdUser").val() +". ¿Desea continuar?")){
		$.ajax({
			url: "/api/adminuser",
			contentType: "application/json",
			data: JSON.stringify({
				data:{$set:{typeUser:$("#rolUser").val()}},
				query:{userUser:$("#adminRolIdUser").val(),typeUser:{ $nin: [1,2] }}
			}),
			fn:"checkActivities",
			params:{userUser:$("#adminRolIdUser").val()},
			type: "PUT",
			success: function(response){
				if (response.err) return notification.show({msg:response.err.message, type:1})
				$("#adminRolIdUser").val("")
				notification.show({msg:response.message, type:response.statusCode})
			}
		})
	}
})

/* Falta Refactorizar */
$("#formOpeUserStatus").submit(function(event){
	var confirmSta

	event.preventDefault()
	if($("#statusUser").val() == 0)
		confirmSta = "INACTIVARÁ"
	else
		confirmSta = "ACTIVARÁ"

	if(confirm("Se " + confirmSta + " a: " + $("#adminStaIdUser").val() +". ¿Desea continuar?")){
		$.ajax({
			url: "/api/adminuser",
			contentType: "application/json",
			data: JSON.stringify({
				data:{$set:{statusUser:$("#statusUser").val()}},
				query:{userUser:$("#adminStaIdUser").val(),typeUser:{ $ne: 2 }}
			}),
			type: "PUT",
			success: function(response){
				$(this).trigger("reset")
				notification.show({msg:response.message, type:response.statusCode})
			}
		})
	}
})

$("#formOpeUser").submit(function(event) {
	event.preventDefault()
	if(confirm("Se borrará el usuario: " + $("#adminOpeIdUser").val() +". ¿Desea continuar?")){
		$.ajax({
			url: "/api/adminuser",
			contentType: "application/json",
			data : JSON.stringify({
				query:{userUser:$("#adminOpeIdUser").val(),typeUser:{ $nin: [1,2] }},
				fn:"checkActivities",
				params:{userUser:$("#adminOpeIdUser").val()}
			}),
			type : "DELETE",
			success: function(response){
				if (response.err) return notification.show({msg:response.err.message, type:1})
				$("#adminOpeIdUser").val("")
				notification.show({msg:response.message, type:response.statusCode})
			}
		})
	}
})

