function NotificationC (){
	var contenedorPrincipal = document.body

	var createMessage = function (data){
		var contenedorMSG = document.createElement("article")
		contenedorMSG.classList.add("contenedorMensaje")
		var mensaje = document.createElement("p")
		mensaje.innerHTML= data.msg
		contenedorMSG.classList.add("MSG")
		var icon = document.createElement("img")

		contenedorMSG.appendChild(icon)
		contenedorMSG.appendChild(mensaje)

		if (data.type == 0) icon.src = "/img/notifications/correcto.png"
		else if(data.type == 1) icon.src = "/img/notifications/incorrecto.png"
		else if(data.type == 2) icon.src = "/img/notifications/informacion.png"

		icon.classList.add("contenedorIcon")
		mensaje.classList.add("contenedorMensaje")

		return contenedorMSG
	}

	this.show = function (data){
		var contenedorMSG = createMessage(data),
			top = window.window.scrollY,
			time = data.time || 3000

		contenedorMSG.setAttribute("style", "top:" + top + "px")
		contenedorPrincipal.appendChild(contenedorMSG)
		setTimeout(this.hide.bind(this), time)
	}
	this.hide = function (){
		contenedorPrincipal.removeChild(contenedorPrincipal.lastChild)
	}
}

//Definir constante que captura un elemento html
const formValidChildren = $("#formValidChildren"),
	formValidUser = $("#formValidUser"),
	formUpdatePass = $("#formUpdatePass"),
	formOpeUserRol = $("#formOpeUserRol"),
	formOpeUserStatus = $("#formOpeUserStatus"),
	formOpeUser = $("#formOpeUser"),
	formNewUser = $("#formNewUser"),
	formFindAll = $("#formFindAll"),
	formOpeValidChildren = $("#formOpeValidChildren")

var showResults = $("#showResults"),
	showResultTeachAdmin = $("#showResultTeachAdmin"),
	showResultChildren = $("#showResultChildren"),
	showResultValid = $("#showResultValid"),
	notification = new NotificationC()

function getClone(selector){
	var t = document.querySelector(selector)
	//var t = document.querySelector("#consulQueryGeneralAvanced")
	return document.importNode(t.content,true)
}

/*function renderResults(node){
	console.log("hola")
	console.log(cshowResults)
	showResults.empty()
	showResults.acppend(node)
}*/
function renderResultTeachAdmin(node){
	showResults.empty()
	showResults.append(node)

}
function renderResultChildren(node){
	showResultChildren.html("")
	showResultChildren.append(node)
}
function renderResultValid(node){
	showResultValid.html("")
	showResultValid.append(node)
}

function funcStatusAct(status){
	var statusText = ""
	if(status == 0)
		statusText = "Pendiente"
	if(status == 1)
		statusText = "Completado"
	return statusText
}

//Asigna un escuchador de evento --- Cuando suceda el evento
function addUser(event){
	event.preventDefault()
	var action = $("button[type='submit']",this).data("action")
	if(action == "create"){
		var url = "/admin/register-user",
			data = {userAdd : $(".userAdd").serialize(),userAdmin : $(".userAdmin").serialize()}
	}else{
		var url = "/admin/update-user",
			data = {userAdd : $(".userAdd").serialize()}
	}


	if($("#passUser").val() == $("#passConfirmUser").val()){

		$.ajax({
			url: url,
			async : false, 
			data : data,
			type : "POST",
			success: function(result){
				if (result.err) return notification.show({msg:result.err.message, type:1})
				//console.log(result)
				$("#formAddUser")
				.trigger("reset")
				.off("submit")
				.addClass("hide")
				$("#validUser").prop("readonly", false)
				notification.show({msg:result.msg, type:result.statusCode})
			}
		})

	}else{
		var msg = "¡Contraseña no coincide!",
			type = 1
		notification.show({msg:msg, type:type})
	}
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
	.removeClass("hide")
	.on("submit",addUser)
	$("#idUser").val($("#validUser").val())
	$("#validUser").prop("readonly", true)
}else{
	/*Creacion de Usuarios*/
	formValidUser.on("submit",(event) => {
		event.preventDefault()
		$.ajax({
			url: "/admin/valid-user",
			async : false, 
			data : $("#formValidUser").serialize(),
			type : "POST",
			success: function(result){
				if(result.valid) {
					$("#formAddUser")
					.removeClass("hide")
					.on("submit",addUser)
					$("#idUser").val($("#validUser").val())
					$("#validUser").prop("readonly", true)
				}else{
					$("#formAddUser")
					.addClass("hide")
					.off("submit",addUser)
					$("#validUser").prop("readonly", false)
					notification.show({msg:result.msg, type:result.statusCode})
				}

			}
		})
	})
}

//Asigna un escuchador de evento --- Cuando suceda el evento
formValidChildren.on("submit",(event) => {
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

formNewUser.on("submit",(event) => {
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
		data : formOpeValidChildren.serializeArray(),
		success: function(result){
			if(result.err) return notification.show({msg:result.err.message, type:1})
			notification.show({msg:result.msg, type:result.statusCode})

			if(result){
				var clone = getClone("#consulQueryChildrenValid"),
					data = $(clone.querySelector("#dataNameChild")),
					activities = result.activitiesvalid

				if(activities.length == 2){
					clone.querySelector("#nameChildren").innerHTML = "Niñ@: " + result.children.nameChildren + " " + result.children.lastnameChildren
					clone.querySelector("#step").innerHTML = "Etapa: " + result.step.stepStep
					clone.querySelector("#step").innerHTML = "Etapa: " + result.step.stepStep

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

					renderResultValid(clone)
				}else notification.show({msg:"¡No cumple con las condiciones necesarias para ser validad@!", type:2})
			}
		}
	})
})

formFindAll.on("submit",(event) => {
	event.preventDefault()
	$.ajax({
		url: "/admin/find-all",
		async : false, 
		type : "POST",
		data : formFindAll.serializeArray(),
		success: function(users){
			if(users.err) return notification.show({msg:users.err.message, type:1})
			if(!users.length) return notification.show({msg:"No hay usuarios", type:1})
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

formUpdatePass.on("submit",(event) => {
	event.preventDefault()
	if($("#adminPassUser").val() == $("#adminPassConfirmUser").val()){
		if(confirm("Se actualizará contraseña a: " + $("#adminIdUser").val() +". ¿Desea continuar?")){
			$.ajax({
				url: "/admin/update-pass",
				async : false, 
				data : $("#formUpdatePass").serialize(),
				type : "POST",
				success: function(result){
					if (result.err) return notification.show({msg:result.err.message, type:1})
					$("#adminIdUser").val("")
					$("#adminPassUser").val("")
					$("#adminPassConfirmUser").val("")
					notification.show({msg:result.msg, type:result.statusCode})
				}
			})
		}
	}else{
		//console.log({msg:"Password not equals"})
		var msg = "¡Contraseña no coincide!"
		notification.show({msg:msg, type:1})
	}
})

formOpeUserRol.on("submit",(event) => {
	event.preventDefault()
	if(confirm("Se actualizará rol a: " + $("#adminRolIdUser").val() +". ¿Desea continuar?")){
		$.ajax({
			url: "/admin/update-rol",
			async : false, 
			data : $("#formOpeUserRol").serialize(),
			type : "POST",
			success: function(result){
				if (result.err) return notification.show({msg:result.err.message, type:1})
				$("#adminRolIdUser").val("")
				notification.show({msg:result.msg, type:result.statusCode})
			}
		})
	}
})

formOpeUserStatus.on("submit",(event) => {
	var confirmSta

	event.preventDefault()
	if($("#statusUser").val() == 0)
		confirmSta = "INACTIVARÁ"
	else
		confirmSta = "ACTIVARÁ"

	if(confirm("Se " + confirmSta + ": " + $("#adminStaIdUser").val() +". ¿Desea continuar?")){
		$.ajax({
			url: "/admin/update-status",
			async : false, 
			data : $("#formOpeUserStatus").serialize(),
			type : "POST",
			success: function(result){
				if (result.err) return notification.show({msg:result.err.message, type:1})
				$("#adminStaIdUser").val("")
				notification.show({msg:result.msg, type:result.statusCode})
			}
		})
	}
})

formOpeUser.on("submit.formOpeUserDel",(event) => {
	event.preventDefault()
	if(confirm("Se borrará: " + $("#adminOpeIdUser").val() +". ¿Desea continuar?")){
		$.ajax({
			url: "/admin/delete-users",
			async : false, 
			data : $("#formOpeUser").serialize(),
			type : "POST",
			success: function(result){
				if (result.err) return notification.show({msg:result.err.message, type:1})
				$("#adminOpeIdUser").val("")
				notification.show({msg:result.msg, type:result.statusCode})
			}
		})
	}
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
			//console.log(result)
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

$("#clicShowAct").on("click",() => {
	$("#showAtc").removeClass("hide")
	$("#add").addClass("hide")
	$("#edit").addClass("hide")
	$("#delete").addClass("hide")
	$("#nameActivityEdit").empty()
	$("#descriptionActivityEdit").empty()
	$("#guideActivityEdit").empty()
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
				$("#actsList").append(tr)
			}
		}
	})
})

$("#clicAddAct").on("click",() => {
	$("#showAtc").addClass("hide")
	$("#add").removeClass("hide")
	$("#edit").addClass("hide")
	$("#delete").addClass("hide")
	$("#nameActivityEdit").empty()
	$("#descriptionActivityEdit").empty()
	$("#guideActivityEdit").empty()
	$("#saveActivity").empty()
	$("#activityActivityEdit").empty()
})

$("#clicEditAct").on("click",() => {
	$("#showAtc").addClass("hide")
	$("#add").addClass("hide")
	$("#edit").removeClass("hide")
	$("#delete").addClass("hide")
	
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
	$("#showAtc").addClass("hide")
	$("#add").addClass("hide")
	$("#edit").addClass("hide")
	$("#delete").removeClass("hide")
	$("#nameActivityEdit").empty()
	$("#descriptionActivityEdit").empty()
	$("#guideActivityEdit").empty()
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
	$("#showStep").removeClass("hide")
	$("#addStep").addClass("hide")
	$("#editStep").addClass("hide")
	$("#deleteStep").addClass("hide")
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

$("#clicAddStep").on("click",() => {
	$("#showStep").addClass("hide")
	$("#addStep").removeClass("hide")
	$("#editStep").addClass("hide")
	$("#deleteStep").addClass("hide")
})

$("#clicEditStep").on("click",() => {
	$("#showStep").addClass("hide")
	$("#addStep").addClass("hide")
	$("#editStep").removeClass("hide")
	$("#deleteStep").addClass("hide")
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
	$("#showStep").addClass("hide")
	$("#addStep").addClass("hide")
	$("#editStep").addClass("hide")
	$("#deleteStep").removeClass("hide")
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
					$("#actsList").append(tr)
				}
			}
		}
	})
})

$("#buttonAddStep").on("click",() => {
	event.preventDefault()
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
	$.ajax({
		url: "/admin/add-activity",
		async : false,
		data : $("#addActs").serialize(),
		type : "POST",
		success: function(result){
			$("#addActs").trigger("reset")
			//$("[guidesActivity]").empty() - otra forma
			if (result.err) return notification.show({msg:result.err.message, type:1})
			notification.show({msg:result.msg, type:result.statusCode})
		}
	})
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
					for(var i = 0; i < 4; i++){
						$("#guideActivityEdit").append(
							$("<input>",{
								type:"text",
								name:"guideActivity",
								id:"guideActivity",
								value: data.guidesActivity[i],
								html: data.guidesActivity[i]})
						)
					}
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
