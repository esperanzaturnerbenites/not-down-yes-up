/* Falta Refactorizar */ 
$("#formFindAll").submit(function(event){
	var data = {}

	if($("#typeConsult").val() == "4"){
		/*Todos*/
		data.query = {typeUser : {$ne: CTE.TYPE_USER.DEVELOPER}}
	}else if($("#typeConsult").val() == "3"){
		/*Inactivos*/
		data.query = {statusUser : CTE.STATUS_USER.INACTIVE, typeUser : {$ne: CTE.TYPE_USER.DEVELOPER}}
	}else if($("#typeConsult").val() == "2"){
		/*Activos*/
		data.query = {statusUser :CTE.STATUS_USER.ACTIVE, typeUser : {$ne: CTE.TYPE_USER.DEVELOPER}}
	}else if($("#typeConsult").val() == "1"){
		/*Docentes*/
		data.query = {typeUser : CTE.TYPE_USER.TEACHER}
	}else if($("#typeConsult").val() == "0"){
		/*Administradores*/
		data.query = {statusUser : CTE.TYPE_USER.ADMINISTRATOR}
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
		success: function(response){
			$("#showResultTeachAdmin").html(response.returnFn)
			$("#showResultTeachAdmin")[0].scrollIntoView()
		}
	})
})

/* Falta Refactorizar */
$("#formNewUser").submit(function(event){
	event.preventDefault()

	if($("#passUser").val() == $("#newPassConfirmUser").val()){
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
			success: function(result){
				if (result.err) return notification.show({msg:result.err.message, type:1})
				$("#formNewUser").trigger("reset")
				notification.show({msg:result.msg, type:result.statusCode})
			}
		})
		/*$.ajax({
			url: "/admin/register-newuser",
			async : false, 
			data : $(this).serialize(),
			type : "POST",
			success: function(result){
				if (result.err) return notification.show({msg:result.err.message, type:1})
				$("#idUser").val("")
				$("#userUser").val("")
				$("#passUser").val("")
				$("#newPassConfirmUser").val("")
				notification.show({msg:result.msg, type:result.statusCode})
			}
		})*/
	}else{
		var msg = "¡Contraseña no coincide!"
		notification.show({msg:msg, type:1})
	}
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
					query:{userUser:$("#adminIdUser").val()},
					fn: "encryptPass",
					params :{passUser:$("#adminPassUser").val()}
				}),
				type: "PUT",
				success: function(result){
					$(this).trigger("reset")
					notification.show({msg:result.msg, type:result.statusCode})
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
				query:{userUser:$("#adminRolIdUser").val()}
			}),
			type: "PUT",
			success: function(result){
				if (result.err) return notification.show({msg:result.err.message, type:1})
				$("#adminRolIdUser").val("")
				notification.show({msg:result.msg, type:result.statusCode})
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

	if(confirm("Se " + confirmSta + ": " + $("#adminStaIdUser").val() +". ¿Desea continuar?")){
		$.ajax({
			url: "/api/adminuser",
			contentType: "application/json",
			data: JSON.stringify({
				data:{$set:{statusUser:$("#statusUser").val()}},
				query:{userUser:$("#adminStaIdUser").val()}
			}),
			type: "PUT",
			success: function(result){
				$(this).trigger("reset")
				notification.show({msg:result.msg, type:result.statusCode})
			}
		})
	}
})

$("#formOpeUser").submit(function(event) {
	event.preventDefault()
	if(confirm("Se borrará: " + $("#adminOpeIdUser").val() +". ¿Desea continuar?")){
		$.ajax({
			url: "/api/adminuser",
			contentType: "application/json",
			data : JSON.stringify({
				query:{userUser:$("#adminOpeIdUser").val()},
				fn:"checkActivities",
				params:{userUser:$("#adminOpeIdUser").val()}
			}),
			type : "DELETE",
			success: function(result){
				if (result.err) return notification.show({msg:result.err.message, type:1})
				$("#adminOpeIdUser").val("")
				notification.show({msg:result.msg, type:result.statusCode})
			}
		})
	}
})

