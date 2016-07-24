/*
	Validacion de ids
		Validadcion Frontend
		Validacion Backend
		POST /admin/id-exists
		Reques Data {Object}
			@propertie {String} id: id a Validar
*/
$(".idChildren,.idMom,.idDad,.idCare").change(function(){
	var target = this,
		selector = "." + $(this).attr("class"),
		otherInput = $(".idChildren,.idMom,.idDad,.idCare").not(selector)

	$.ajax({
		url: "/api/id-exists",
		data : {id: $(this).val()},
		type : "POST",
		success: function(response){
			if (response.statusCode != CTE.STATUS_CODE.OK) {
				$(target).val("")
				return notification.show({msg:response.msg, type:response.statusCode})
			}
			otherInput.each(function(index,element){
				if($(element).val() == $(target).val()) {
					$(target).val("")
					notification.show({
						msg:"Hay Identificaiones Repetidas",
						type:CTE.STATUS_CODE.INFORMATION
					})
				}
			})
		}
	})
})

//*********************************Hizo Luz ma**************************************
//Asigna un escuchador de evento --- Cuando suceda el evento 
$("#formValidChildren").on("submit",(event) => {
	event.preventDefault()
	$.ajax({
		url: "/api/children",
		contentType: "application/json",
		data : JSON.stringify({query:{idChildren:$("#validChildren").val()}}),
		type : "POST",
		success: function(response){
			if (response.documents.err) return notification.show({msg:response.documents.message, type:CTE.STATUS_CODE.NOT_OK})
			if(!response.documents.length){
				$("#formAddChildren")
				.removeClass("hide")
				$("#idChildren").val($("#validChildren").val())
				$("#validChildren").prop("readonly", true)
			}else{
				$("#formAddChildren")
				.addClass("hide")
				$("#validChildren").prop("readonly", false)
				notification.show({msg:"¡Niñ@ ya existe!", type:CTE.STATUS_CODE.INFORMATION})
			}
		}
	})
	/*$.ajax({
		url: "/admin/valid-children",
		async : false, 
		data : $("#formValidChildren").serialize(),
		type : "POST",
		success: function(result){
			if(result.valid) {
				$("#formAddChildren")
				.removeClass("hide")
				//.on("submit",addChildren)
				$("#idChildren").val($("#validChildren").val())
				$("#validChildren").prop("readonly", true)
			}else{
				$("#formAddChildren")
				.addClass("hide")
				//.off("submit",addChildren)
				$("#validChildren").prop("readonly", false)
				notification.show({msg:result.msg, type:result.statusCode})
			}
		}
	})*/
})

if(eval($("#editingChildren").val())){
	/*Edicion de niñ@s*/
	$("#formAddChildren").attr("action","/admin/update-children")
}else{
	/*Creacion de niñ@s*/
	$("#formAddChildren").attr("action","/admin/register-children")
}

if(eval($("#editingUser").val())){
	/*Edicion de usuarios*/
	$("#formAddUser")
		.attr("action","/admin/update-user")
		.removeClass("hide")
	$("#idUser").val($("#validUser").val())
	$("#validUser").prop("readonly", true)
}else{
	/*Creacion de Usuarios*/
	$("#formAddUser").attr("action","/admin/register-user")
	$("#formValidUser").on("submit",(event) => {
		event.preventDefault()
		$.ajax({
			url: "/api/id-exists",
			data : {id:$("#validUser").val()},
			type : "POST",
			success: function(response){
				if (response.statusCode != CTE.STATUS_CODE.OK) {
					$("#formAddUser").addClass("hide")
					$("#validUser").prop("readonly", false)
					notification.show({
						msg:"Esta Identificaion ya se encuentra registrada",
						type:CTE.STATUS_CODE.INFORMATION
					})
				}else{
					$("#formAddUser").removeClass("hide")
					$("#idUser").val($("#validUser").val())
					$("#validUser").prop("readonly", true)
				}
			}
		})
	})
}