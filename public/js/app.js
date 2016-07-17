function getClone(selector){
	var t = document.querySelector(selector)
	//var t = document.querySelector("#consulQueryGeneralAvanced")
	return document.importNode(t.content,true)
}

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
		url: "/admin/id-exists",
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

$("#formUpdatePass").on("submit",(event) => { 
	event.preventDefault()
	if($("#adminPassUser").val() == $("#adminPassConfirmUser").val()){
		if(confirm("Se actualizará contraseña a: " + $("#adminIdUser").val() +". ¿Desea continuar?")){
			$.ajax({
				url: "/api/adminuser",
				contentType: "application/json",
				data: JSON.stringify({
					data:{passUser:$("#adminPassUser").val()},
					query:{userUser:$("#adminIdUser").val()},
					fn: "encryptPass",
					params :{passUser:$("#adminPassUser").val()}
				}),
				type: "PUT",
				success: function(result){
					$("#formUpdatePass").trigger("reset")
					notification.show({msg:result.msg, type:result.statusCode})
				}
			})
		}
	}else{
		notification.show({msg:"¡Contraseña no coincide!", type:CTE.STATUS_CODE.NOT_OK})
	}
})

$("#formOpeUserRol").on("submit",(event) => {
	event.preventDefault()
	if(confirm("Se actualizará rol a: " + $("#adminRolIdUser").val() +". ¿Desea continuar?")){
		$.ajax({
			url: "/api/adminuser",
			contentType: "application/json",
			data: JSON.stringify({
				data:{typeUser:$("#rolUser").val()},
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

$("#formOpeUserStatus").on("submit",(event) => {
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
				data:{statusUser:$("#statusUser").val()},
				query:{userUser:$("#adminStaIdUser").val()}
			}),
			type: "PUT",
			success: function(result){
				$("#formOpeUserStatus").trigger("reset")
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

function renderResultTeachAdmin(node){
	$("#showResults").empty()
	$("#showResults").append(node)

}
function renderResultChildren(node){
	$("#showResultChildren").html("")
	$("#showResultChildren").append(node)
}

function renderResultValidAdmin(node){
	$("#showResultValid").html("")
	$("#showResultValid").append(node)
}

function funcStatusAct(status){
	var statusText = ""
	if(status == 0)
		statusText = "No Completado"
	if(status == 1)
		statusText = "Completado"
	return statusText
}

function typeUserFind(type){
	var typeU = ""
	if(type == "0"){
		typeU = "Administrador"
		return typeU
	}else if(type == "1"){
		typeU = "Docente"
		return typeU
	}
}

//Asigna un escuchador de evento --- Cuando suceda el evento
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
			url: "/admin/id-exists",
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

//Asigna un escuchador de evento --- Cuando suceda el evento
$("#formValidChildren").on("submit",(event) => {
	event.preventDefault()
	$.ajax({
		url: "/admin/valid-children",
		async : false, 
		data : $("#formValidChildren").serialize(),
		type : "POST",
		success: function(result){
			if (result.err) return notification.show({msg:result.err.message, type:1})
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
	})
})

$("#formNewUser").on("submit",(event) => {
	event.preventDefault()

	if($("#passUser").val() == $("#newPassConfirmUser").val()){
		$.ajax({
			url: "/admin/register-newuser",
			async : false, 
			data : $("#formNewUser").serialize(),
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

//Revisar valid step
$("#formValidChildrenValid").on("click",(event) => {
	event.preventDefault()
	$.ajax({
		url: "/admin/show-valid-step",
		async : false, 
		type : "POST",
		data : $("#formOpeValidChildren").serializeArray(),
		success: function(result){
			if(result.err) return notification.show({msg:result.err.message, type:1})
			notification.show({msg:result.msg, type:result.statusCode})

			if(result){
				var clone = getClone("#consulQueryChildrenValid"),
					data = $(clone.querySelector("#dataNameChild")),
					activities = result.activitiesvalid

				if(activities.length >= 2){
					clone.querySelector("#nameChildren").innerHTML = "Niñ@: " + result.children.nameChildren + " " + result.children.lastnameChildren
					clone.querySelector("#step").innerHTML = "Etapa: " + result.step.stepStep
					//clone.querySelector("#step").innerHTML = "Etapa: " + result.step.stepStep

					var num = 0,
						scoreS = 0

					for (var activity of activities){
						num++
						scoreS += activity.scoreTeachActivity
						var a = $("<article>").append(
								h3 = $("<h2>",{html : "ACTIVIDAD " + num + ": " + activity.idActivity.nameActivity})),
							a2 = $("<article>").append(
								label = $("<label>",{html : "Estado: " }),
								input = $("<input>")
								.prop("type", "text")
								.attr({id:"actStatus" + num})
								.prop("readonly", true)
								.prop("name", "actStatus" + num)
								.val(funcStatusAct(activity.statusActivity))),
							a3 = $("<article>").append(
								label = $("<label>",{html : "Puntaje: " }),
								input = $("<input>")
								.prop("type", "number")
								.attr({id:"actScore" + num})
								.prop("readonly", true)
								.prop("name", "actScore" + num)
								.val(activity.scoreTeachActivity))
						data.append(a, a2, a3)


						/*var infoActivity = clone.querySelector("#infoActivity")
						infoActivity.querySelector("#nameActivity1").innerHTML = "Actividad 1: " + activities[0].idActivity.nameActivity
						infoActivity.querySelector("#actStatus1").value = funcStatusAct(activities[0].statusActivity)
						infoActivity.querySelector("#actScore1").value = activities[0].scoreTeachActivity
						infoActivity.querySelector("#nameActivity2").innerHTML = "Actividad 1: " + activities[1].idActivity.nameActivity
						infoActivity.querySelector("#actStatus2").value = funcStatusAct(activities[1].statusActivity)
						infoActivity.querySelector("#actScore2").value = activities[1].scoreTeachActivity
						*/
					}

					var scoreStepValid = scoreS/num
					clone.querySelector("#scoreStep").value = scoreStepValid

					if(scoreStepValid >= 6){
						clone.querySelector("#statusStep").value = "Completada"
					}else{
						clone.querySelector("#statusStep").value = "No Completada"
					}

					$("#idChildren").prop("readonly", true)

					$("#cancelValidStep",clone).click(()=>{
						$("#formValidChildren").remove()
						$("#idChildren").val("")
						$("#idChildren").prop("readonly", false)
					})

					var idStep = result.step._id,
						idChildren = result.children.idChildren,
						statStep = 0

					if($("#statusStep").val() == "No Completada")
						statStep = 0
					else if($("#statusStep").val() == "Completada")
						statStep = 1

					$("#validStep",clone).click(()=>{
						event.preventDefault()
						if(activities.length == 2){
							$.ajax({
								url: "/admin/valid-step",
								async : false, 
								type : "POST",
								data : {observationStep : $("#observationStep").val(),
										scoreStep : $("#scoreStep").val(),
										idStep : idStep,
										idChildren : idChildren,
										statusStep :  statStep},
								success: function(result){
									if(result.err) return notification.show({msg:result.err.message, type:1})
									$("#formValidChildren").remove()
									$("#idChildren").val("")
									$("#idChildren").prop("readonly", false)
									notification.show({msg:result.msg, type:result.statusCode})
								}
							})
						}
					})
					console.log(clone)
					renderResultValidAdmin(clone)
				}else notification.show({msg:"¡No cumple con las condiciones necesarias para ser validad@!", type:2})
			}
		}
	})
})

$("#formFindAll").on("submit",(event) => {
	event.preventDefault()
	$.ajax({
		url: "/admin/find-all",
		async : false, 
		type : "POST",
		data : $("#formFindAll").serializeArray(),
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

$("#formOpeTeachAdminDel").on("click",(event) => {
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

$("#formOpeTeachAdminInfo").on("click",(event) => {
	event.preventDefault()
	$.ajax({
		url: "/admin/found-users",
		async : false, 
		data : $("#adminOpeTeachAdmin").serialize(),
		type : "POST",
		success: function(result){
			if (result.err) return notification.show({msg:result.err.message, type:1})
			notification.show({msg:result.msg, type:result.statusCode})
			if(result._id){
				window.open("/admin/info-user/" + $("#adminOpeTeachAdmin").val())
			}
		}
	})
})

$("#formOpeTeachAdminUpd").on("click",(event) => {
	event.preventDefault()
	$.ajax({
		url: "/admin/found-users",
		async : false, 
		data : $("#adminOpeTeachAdmin").serialize(),
		type : "POST",
		success: function(result){
			if (result.err) return notification.show({msg:result.err.message, type:1})
			notification.show({msg:result.msg, type:result.statusCode})
			if(result._id){
				window.open("/admin/register-user/" + $("#adminOpeTeachAdmin").val())
			}
		}
	})
})

$("#formOpeChildrenDel").on("click.",(event) => {
	event.preventDefault()
	$.ajax({
		url: "/admin/delete-childrens",
		async : false, 
		data : $("#formOpeChildren").serialize(),
		type : "POST",
		success: function(result){
			if (result.err) return notification.show({msg:result.err.message, type:1})
			notification.show({msg:result.msg, type:result.statusCode})
		}
	})
})

$("#formOpeChildrenUpd").on("click",(event) => {
	event.preventDefault()
	var params = $("#adminInfoChildren").val()
	event.preventDefault()
	$.ajax({
		url: "/admin/found-childrens",
		async : false, 
		data : $("#adminInfoChildren").serialize(),
		type : "POST",
		success: function(result){
			if (result.err) return notification.show({msg:result.err.message, type:1})
			notification.show({msg:result.msg, type:result.statusCode})
			if(result._id){
				window.open("/admin/register-children/" + params)
			}
			//console.log(result)
		}
	})
})

$("#formOpeChildrenInfo").on("click",(event) => {
	event.preventDefault()
	$.ajax({
		url: "/admin/found-childrens",
		async : false, 
		data : $("#adminInfoChildren").serialize(),
		type : "POST",
		success: function(result){
			if (result.err) return notification.show({msg:result.err.message, type:1})
			notification.show({msg:result.msg, type:result.statusCode})
			if(result._id){
				window.open("/admin/info-children/" + $("#adminInfoChildren").val())
			}
		}
	})
})

$("#formOpeChildrenStatusUpd").on("click.",(event) => {
	event.preventDefault()
	$.ajax({
		url: "/admin/inactivate-children",
		async : false, 
		data : $("#formOpeStatusChildren").serialize(),
		type : "POST",
		success: function(result){
			if (result.err) return notification.show({msg:result.err.message, type:1})
			notification.show({msg:result.msg, type:result.statusCode})
		}
	})
})

/*$("#formOpeChildrenInfo").on("click",(event) => {
	event.preventDefault()
	$.ajax({
		url: "/admin/found-childrens",
		async : false, 
		data : $("#adminInfoChildren").serialize(),
		type : "POST",
		success: function(result){
			if (result.err) return notification.show({msg:result.err.message, type:1})
			notification.show({msg:result.msg, type:result.statusCode})
			if(result._id){
				window.open("/admin/info-children/" + $("#adminInfoChildren").val())
			}
		}
	})
})*/

$("[data-id = adminActivities]").on("click", function() {
	var selector = $(this).data("reference")
	$(".selector-hide").addClass("hide")
	if(selector){
		$(selector).removeClass("hide")
	}
})

$("#clicShowAct").on("click",() => {
	$("#nameActivityEdit").empty()
	$("#descriptionActivityEdit").empty()
	$("#guideActivityEdit").empty()
	$("#guideChildEdit").empty()
	$("#saveActivity").empty()
	$("#activityActivityEdit").empty()

	$.ajax({
		url: "/admin/found-all-step-activities",
		async : false,
		type : "POST",
		success: function(result){
			var data = result.data
			$("#stepActivityList").empty()
			$("#actsList").empty()

			for(var step of data.steps){
				$("#stepActivityList").append(
					$("<option>",{
						html:step.stepStep + " - " + step.nameStep,
						value:step.stepStep})
				)
			}
			for(var stepList of data.activities){
				var tr = $("<tr>",{id:"trAddGuide"}).append(
						$("<td>",{html: stepList.activityActivity}),
						$("<td>",{html: stepList.nameActivity}),
						$("<td>",{html: stepList.descriptionActivity})
						)
				for(var guide of stepList.guidesActivity){
					tr.append(
						$("<td>",{html: guide})
					)
				}
				for(var guideChild of stepList.guidesChild){
					tr.append(
						$("<td>",{html: guideChild})
					)
				}
				$("#actsList").append(tr)
			}
		}
	})
})

$("#clicAddAct").on("click",() => {
	$("#nameActivityEdit").empty()
	$("#descriptionActivityEdit").empty()
	$("#guideActivityEdit").empty()
	$("#guideChildEdit").empty()
	$("#saveActivity").empty()
	$("#activityActivityEdit").empty()
})

$("#clicEditAct").on("click",() => {
	$.ajax({
		url: "/admin/found-all-step-activities",
		async : false,
		type : "POST",
		success: function(result){
			var data = result.data
			$("#stepActivityEdit").empty()
			$("#activityActivityEdit").empty()

			for(var step of data.steps){
				$("#stepActivityEdit").append(
					$("<option>",{
						html:step.stepStep + " - " + step.nameStep,
						value:step.stepStep})
				)
			}
			for(var act of data.activities){
				$("#activityActivityEdit").append(
					$("<option>",{
						html:"Actividad: " + act.activityActivity + " - " + act.nameActivity,
						value:act.activityActivity})
				)
			}
		}
	})
})

$("#clicDeleteAct").on("click",() => {
	$("#nameActivityEdit").empty()
	$("#descriptionActivityEdit").empty()
	$("#guideActivityEdit").empty()
	$("#guideChildEdit").empty()
	$("#saveActivity").empty()
	$("#activityActivityEdit").empty()

	$.ajax({
		url: "/admin/found-all-step-activities",
		async : false,
		type : "POST",
		success: function(result){
			var data = result.data
			$("#stepActivityDel").empty()
			$("#activityActivityDel").empty()

			for(var step of data.steps){
				$("#stepActivityDel").append(
					$("<option>",{
						html:step.stepStep + " - " + step.nameStep,
						value:step.stepStep})
				)
			}
			for(var act of data.activities){
				$("#activityActivityDel").append(
					$("<option>",{
						html:"Actividad: " + act.activityActivity + " - " + act.nameActivity,
						value:act.activityActivity})
				)
			}
		}
	})
})

$("#clicShowStep").on("click",() => {
	$.ajax({
		url: "/admin/found-all-step-activities",
		async : false,
		type : "POST",
		success: function(result){
			var data = result.data
			$("#stepList").empty()

			for(var stepList of data.steps){
				$("#stepList").append(
					$("<tr>").append(
						$("<td>",{html: stepList.stepStep}),
						$("<td>",{html: stepList.nameStep}),
						$("<td>",{html: stepList.descriptionStep})
						//$("<td>",{html: stepList.guidesActivity})
						)
				)
			}
		}
	})
})

$("#clicEditStep").on("click",() => {
	$.ajax({
		url: "/admin/found-all-step-activities",
		async : false,
		type : "POST",
		success: function(result){
			var data = result.data
			$("#stepStepEdit").empty()

			for(var step of data.steps){
				$("#stepStepEdit").append(
					$("<option>",{
						html:step.stepStep + " - " + step.nameStep,
						value:step.stepStep})
				)
			}
		}
	})
})

$("#clicDeleteStep").on("click",() => {
	$.ajax({
		url: "/admin/found-all-step-activities",
		async : false,
		type : "POST",
		success: function(result){
			var data = result.data
			$("#stepDel").empty()

			for(var step of data.steps){
				$("#stepDel").append(
					$("<option>",{
						html:step.stepStep + " - " + step.nameStep,
						value:step.stepStep})
				)
			}
		}
	})
})

$("#stepActivityEdit").change(() => {
	var step = {stepStep:$("#stepActivityEdit").val()}
	$.ajax({
		url: "/admin/consul-step-acts",
		async : false,
		data : step,
		type : "POST",
		success: function(result){
			$("#nameActivityEdit").empty()
			$("#descriptionActivityEdit").empty()
			$("#guideActivityEdit").empty()
			$("#guideChildEdit").empty()
			$("#saveActivity").empty()
			$("#activityActivityEdit").empty()
			if(result.steps){
				for(step of result.steps){
					$("#activityActivityEdit").append(
						$("<option>",{
							html: "Actividad: " + step.activityActivity + " - " + step.nameActivity,
							value: step.activityActivity})
					)
				}
			}
		}
	})
})

$("#stepActivityDel").change(() => {
	var step = {stepStep:$("#stepActivityDel").val()}
	$.ajax({
		url: "/admin/consul-step-acts",
		async : false,
		data : step,
		type : "POST",
		success: function(result){
			$("#activityActivityDel").empty()
			if(result.steps){
				for(step of result.steps){
					$("#activityActivityDel").append(
						$("<option>",{
							html: "Actividad: " + step.activityActivity + " - " + step.nameActivity,
							value: step.activityActivity})
					)
				}
			}
		}
	})
})

$("#stepActivityList").change(() => {
	var step = {stepStep:$("#stepActivityList").val()}
	$.ajax({
		url: "/admin/consul-step-acts",
		async : false,
		data : step,
		type : "POST",
		success: function(result){
			$("#actsList").empty()
			if(result.steps){
				for(step of result.steps){
					var tr =$("<tr>",{id:"trAddGuide"}).append(
						$("<td>",{html: step.activityActivity}),
						$("<td>",{html: step.nameActivity}),
						$("<td>",{html: step.descriptionActivity})
						//$("<td>",{html: step.guidesActivity})
						)
					for(var guide of step.guidesActivity){
						tr.append(
							$("<td>",{html: guide})
						)
					}
					for(var guideChild of step.guidesChild){
						tr.append(
							$("<td>",{html: guideChild})
						)
					}
					$("#actsList").append(tr)
				}
			}
		}
	})
})

$("#buttonAddStep").on("click",() => {
	event.preventDefault()
	if($("#stepStep").val()!="" && $("#nameStep").val()!="" && $("#descriptionStep").val()!=""){
		if(confirm("Se creará una nueva etapa. ¿Desea continuar?")){
			$.ajax({
				url: "/admin/add-step",
				async : false,
				data : $("#addSteps").serialize(),
				type : "POST",
				success: function(result){
					$("#stepStep").val("")
					$("#nameStep").val("")
					$("#descriptionStep").val("")
					if (result.err) return notification.show({msg:result.err.message, type:1})
					notification.show({msg:result.msg, type:result.statusCode})
				}
			})
		}
	}else{
		notification.show({msg:"¡Diligencia todos los campos obligatorios!", type:1})
	}
})

$("#buttonEditStep").on("click",() => {
	event.preventDefault()

	var step = {stepStep:$("#stepStepEdit").val()}
	$.ajax({
		url: "/admin/found-steps-acts",
		async : false,
		data : step,
		type : "POST",
		success: function(result){
			var data = result.data
			$("#nameStepEdit").empty()
			$("#descriptionStepEdit").empty()
			$("#saveStep").empty()
			if(data.steps){
				$("#nameStepEdit").append(
					$("<input>",{
						type:"text",
						name:"nameStep",
						id:"nameStep",
						html:data.steps.nameStep,
						value:data.steps.nameStep})
				)
				$("#descriptionStepEdit").append(
					$("<textarea>",{
						type:"text",
						name:"descriptionStep",
						id:"descriptionStep",
						value: data.steps.descriptionStep,
						html: data.steps.descriptionStep})
				)
				$("#saveStep").append(
					$("<button>",{
						type:"submit",
						name:"butonSaveStep",
						id:"butonSaveStep",
						value: "Guardar",
						html: "Guardar"})
				)
				$("#butonSaveStep").click(()=>{
					event.preventDefault()
					if(confirm("Se editará la etapa N° " + $("#stepStepEdit").val() + " ¿Desea continuar?")){
						$.ajax({
							url: "/admin/save-edit-step",
							async : false,
							data : $("#editSteps").serialize(),
							type : "POST",
							success: function(result){
								$("#nameStepEdit").empty()
								$("#descriptionStepEdit").empty()
								$("#saveStep").empty()
								if (result.err) return notification.show({msg:result.err.message, type:1})
								notification.show({msg:result.msg, type:result.statusCode})
							}
						})
					}
				})
			}
		}
	})
})

$("#buttonDelStep").on("click",() => {
	event.preventDefault()
	if(confirm("Se borrará la etapa N° " + $("#stepDel").val() + ", junto con todas sus actividades ¿Desea continuar?")){
		$.ajax({
			url: "/admin/delete-step",
			async : false,
			data : $("#deleteSteps").serialize(),
			type : "POST",
			success: function(result){
				if (result.err) return notification.show({msg:result.err.message, type:1})
				notification.show({msg:result.msg, type:result.statusCode})
			}
		})
	}
})

$("#buttonAddActivity").on("click",() => {
	event.preventDefault()
	if($("#activityActivity").val()!="" && $("#nameActivity").val()!="" && $("#descriptionActivity").val()!="" && $("#guidesActivity").val()!="" && $("#guidesChild").val()!="" && $("#stepActivity").val()!=null){
		if(confirm("Se creará una nueva actividad. ¿Desea continuar?")){
			$.ajax({
				url: "/admin/add-activity",
				async : false,
				data : $("#addActs").serialize(),
				type 	: "POST",
				success: function(result){
					$("#addActs").trigger("reset")
					//$("[guidesActivity]").empty() - otra forma
					if (result.err) return notification.show({msg:result.err.message, type:1})
					notification.show({msg:result.msg, type:result.statusCode})
				}
			})
		}
	}else{
		notification.show({msg:"¡Diligencia todos los campos obligatorios!", type:1})
	}
})

$("#buttonEditAct").on("click",() => {
	event.preventDefault()

	if($("#activityActivityEdit").val()){
		$.ajax({
			url: "/admin/consul-acts",
			async : false,
			data : $("#editActs").serialize(),
			type : "POST",
			success: function(result){
				var data = result.activities
				$("#nameActivityEdit").empty()
				$("#descriptionActivityEdit").empty()
				$("#guideActivityEdit").empty()
				$("#guideChildEdit").empty()
				$("#saveActivity").empty()
				if(data){
					$("#nameActivityEdit").append(
						$("<input>",{
							type:"text",
							name:"nameActivity",
							id:"nameActivity",
							html:data.nameActivity,
							value:data.nameActivity})
					)
					$("#descriptionActivityEdit").append(
						$("<textarea>",{
							type:"text",
							name:"descriptionActivity",
							id:"descriptionActivity",
							value: data.descriptionActivity,
							html: data.descriptionActivity})
					)
					var fieldsetAct = $("<fieldset>")
					for(var i = 0; i < 4; i++){
						fieldsetAct.append(
							$("<input>",{
								type:"text",
								name:"guideActivity",
								id:"guideActivity",
								value: data.guidesActivity[i],
								html: data.guidesActivity[i]})
						)
					}
					$("#guideChildEdit").append(fieldsetAct)

					var fieldset = $("<fieldset>")
					for(var j = 0; j < 3; j++){
						fieldset.append(
							$("<input>",{
								type:"text",
								name:"guideChild",
								id:"guideChild",
								value: data.guidesChild[j],
								html: data.guidesChild[j]})
						)
					}
					$("#guideChildEdit").append(fieldset)

					$("#saveActivity").append(
						$("<button>",{
							type:"submit",
							name:"buttonSaveActivity",
							id:"buttonSaveActivity",
							value: "Guardar",
							html: "Guardar"})
					)
					$("#buttonSaveActivity").click(()=>{
						event.preventDefault()
						if(confirm("Se editará la actividad N° " + $("#activityActivityEdit").val() + " ¿Desea continuar?")){
							$.ajax({
								url: "/admin/save-edit-activity",
								async : false,
								data : $("#editActs").serialize(),
								type : "POST",
								success: function(result){
									$("#nameActivityEdit").empty()
									$("#descriptionActivityEdit").empty()
									$("#guideActivityEdit").empty()
									$("#guideChildEdit").empty()
									$("#saveActivity").empty()
									if (result.err) return notification.show({msg:result.err.message, type:1})
									notification.show({msg:result.msg, type:result.statusCode})
								}
							})
						}
					})
				}
			}
		})
	}else{
		notification.show({msg:"¡No hay actividades en esta etapa!", type:1})
	}
})

$("#deleteActivity").on("click",() => {
	event.preventDefault()
	if($("#activityActivityDel").val()){
		if(confirm("Se borrará la actividad N° " + $("#activityActivityDel").val() + " ¿Desea continuar?")){
			$.ajax({
				url: "/admin/delete-activity",
				async : false,
				data : $("#deleteActs").serialize(),
				type : "POST",
				success: function(result){
					if (result.err) return notification.show({msg:result.err.message, type:1})
					notification.show({msg:result.msg, type:result.statusCode})
				}
			})
		}
	}else{
		notification.show({msg:"¡No hay actividades en esta etapa!", type:1})
	}
})
