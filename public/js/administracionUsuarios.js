/* Falta Refactorizar */ 
$("#formFindAll").submit(function(event){
	event.preventDefault()
	$.ajax({
		url: "/admin/find-all",
		async : false, 
		type : "POST",
		data : $(this).serializeArray(),
		success: function(users){
			if(users.err) return notification.show({msg:users.err.message, type:1})
			if(!users.length){
				$("#articleFindAll").remove()
				return notification.show({msg:"No hay usuarios", type:1})
			} 
			var clone = getClone("#consulQueryUser")
			var data = $(clone.querySelector("#dataFindAll"))

			for (var adminuser of users){
				var statusUserFind = ""
				if(adminuser.statusUser == 0)
					statusUserFind = "INACTIVO"
				if(adminuser.statusUser == 1)
					statusUserFind = "ACTIVO"
				//console.log(users)
				var tr = $("<tr>").append(
					$("<td>",{html : adminuser.userUser }),
					$("<td>",{html : typeUserFind(adminuser.typeUser)}),
					$("<td>",{html : statusUserFind}),
					$("<td>",{html : adminuser.idUser.nameUser + " " + adminuser.idUser.lastnameUser}),
					$("<td>",{html : adminuser.dateUser })
				)
				data.append(tr)

				$("#buttonCancelFindAll",clone).click(()=>{
					$("#articleFindAll").remove()
				})
			}
			renderResultTeachAdmin($(clone))
			window.myvar = clone
		}
	})
})

/* Falta Refactorizar */
$("#formNewUser").submit(function(event){
	event.preventDefault()

	if($("#passUser").val() == $("#newPassConfirmUser").val()){
		$.ajax({
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
		})
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

$("#formOpeTeachAdminInfo").click(function(event){
	event.preventDefault()
	$.ajax({
		url: "/api/user",
		contentType: "application/json",
		data : JSON.stringify({query:{idUser:$("#adminOpeTeachAdmin").val()}}),
		type : "POST",
		success: function(response){
			if(response.documents.length){
				window.open("/admin/info-user/" + $("#adminOpeTeachAdmin").val())
			}else{
				notification.show({msg:"El usuario de autenticación no existe", type:CTE.STATUS_CODE.INFORMATION})
			}
		}
	})
})

$("#formOpeTeachAdminUpd").click(function(event){
	event.preventDefault()
	$.ajax({
		url: "/api/user",
		contentType: "application/json",
		data : JSON.stringify({query:{idUser:$("#adminOpeTeachAdmin").val()}}),
		type : "POST",
		success: function(response){
			if(response.documents.length){
				window.open("/admin/register-user/" + $("#adminOpeTeachAdmin").val())
			}else{
				notification.show({msg:"El Administrador No existe", type:CTE.STATUS_CODE.INFORMATION})
			}
		}
	})
})

/* Falta Refactorizar */
$("#formOpeTeachAdminDel").click(function(event){
	event.preventDefault()
	if(confirm("Se borrará: " + $("#adminOpeTeachAdmin").val() +". ¿Desea continuar?")){
		$.ajax({
			url: "/admin/delete-teachadmin",
			async : false, 
			data : $("#formOpeTeachAdmin").serialize(),
			type : "POST",
			success: function(result){
				if (result.err) return notification.show({msg:result.err.message, type:1})
				$("#adminOpeTeachAdmin").val("")
				notification.show({msg:result.msg, type:result.statusCode})
			}
		})
	}
})