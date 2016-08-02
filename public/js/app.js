/*
	Validacion de ids
		Validadcion Frontend
		Validacion Backend
		POST /admin/id-exists
		Reques Data {Object}
			@propertie {String} id: id a Validar
*/
$(".idMom,.idDad,.idCare").change(function(){
	var target = this,
		selector = "." + $(this).attr("class"),
		otherInput = $(".idChildren,.idMom,.idDad,.idCare").not(selector)

	$.ajax({
		url: "/api/id-exists",
		data : {id: $(this).val()},
		type : "POST",
		success: function(response){
			var containerInputs = $(target).closest("fieldset.data")
			$(":input",containerInputs).not(selector).prop("disabled",false).val("")
			
			otherInput.each(function(index,element){
				if($(target).attr("class") != "idCare"){
					if($(element).val() == $(target).val()) {
						$(target).val("")
						notification.show({
							msg:"Hay Identificaiones Repetidas",
							type:CTE.STATUS_CODE.INFORMATION
						})
					}
				}else{
					if($(".idChildren").val() == $(".idCare").val()) {
						$(target).val("")
						notification.show({
							msg:"Hay Identificaiones Repetidas",
							type:CTE.STATUS_CODE.INFORMATION
						})
					}

				}
			})
			if (response.statusCode != CTE.STATUS_CODE.OK) {
				if(response.parent){
					$(":input",containerInputs).not(selector).prop("disabled",true)
					$("#nameParent",containerInputs).val(response.parent.nameParent)
					$("#lastnameParent",containerInputs).val(response.parent.lastnameParent)
				}else{
					$(target).val("")
					return notification.show({msg:response.message, type:response.statusCode})
				}
			}
		}
	})
})

$("#formValidChildren").on("submit",(event) => {
	event.preventDefault()
	$.ajax({
		url: "/api/children",
		contentType: "application/json",
		data : JSON.stringify({query:{idChildren:$("#validChildren").val()}}),
		type : "POST",
		success: function(response){
			if (response.err) return notification.show({msg:response.message, type:CTE.STATUS_CODE.NOT_OK})
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