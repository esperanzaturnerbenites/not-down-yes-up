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

var formAddChildAct = $("#formAddChildAct"),
	showChildrensCont = $("#showChildrensCont"),
	activityChildrens = $("#activityChildrens"),
	showValidAct = $("#showValidAct"),
	results = $("#results"),
	resultStep = null,
	notification = new NotificationC()

function getClone(selector){
	var t = document.querySelector(selector)
	return document.importNode(t.content,true)
}

function renderResults(node){showChildrensCont.html(""); showChildrensCont.append(node)}
function renderResultAct(node){activityChildrens.html(""); activityChildrens.append(node)}
function renderResultValid(node){showValidAct.html(""); showValidAct.append(node)}
function renderResultDataResult(node){results.html(""); results.append(node)}
function renderResultDataStep(node){resultStep.html(""); resultStep.append(node)}

function initActivityArduino(){
	$.ajax({
		url: "/estimulation/arduino/init",
		async : true,
		type : "POST",
		data : {numberPin : $("#numberPin").val()},
		success: response => {
			console.log(response)
		}
	})
}

function funcStatusAct(status){
	var statusText = ""
	if(status == 0)
		statusText = "Pendiente"
	if(status == 1)
		statusText = "Completado"
	return statusText
}

formAddChildAct.on("submit",(event) => {
	event.preventDefault()

	$.ajax({
		url: "/estimulation/found-children",
		async : false,
		data : $("#formAddChildAct").serialize(),
		type : "POST",
		success: function(childrens){
			if (childrens.err) return notification.show({msg:childrens.err.message, type:1})
			if(childrens.nameChildren != null) {

				initActivityArduino()

				var clone = getClone("#consulQueryAddChild"),
					cloneAct = getClone("#consulQueryActivityChild")
				var data = $(clone.querySelector("#showChildrens")),
					dataAct = $(clone.querySelector("#activityChildrens"))

				var pName = $("<p>").attr({id:childrens.idChildren}).append(
						span = $("<span>",{html : "Identificación: " + childrens.idChildren})
					),
					pId = $("<p>").attr({id:childrens.idChildren}).append(
						span = $("<span>",{html : childrens.nameChildren + " " + childrens.lastnameChildren})
					),
					button = $("<button>")
						.attr("id","infoChildren")
						.attr("type","button")
						.click(() => {
							window.open("/estimulation/infoChildren/" + $("#idChildren").val())
						})
						.append($("<span>", {html : "Info: " + childrens.nameChildren})
					)
				data.append(pName)
				data.append(pId)
				data.append(button)

				$("#cancelAddChildren",clone).click(()=>{
					$("#formValidChildren").remove()
					$("#formInicAct").remove()
					$("#nameChild").remove()
					$("#nameChild1").remove()
					$("#nameChild2").remove()
					$("#idChildren").prop("readonly", false)
					$("#idChildren").val("")
					$("#numberPin").prop("readonly", false)
					$("#numberPin").val("")
					$("#validActClicDef").prop("disabled", true)
					$("#validActClic").prop("disabled", true)
				})
				renderResults(clone)
				renderResultAct(cloneAct)

				$("#idChildren").prop("readonly", true)
				$("#numberPin").prop("readonly", true)
				$("#validActClicDef").prop("disabled", false)
				$("#validActClic").prop("disabled", false)

			}
		}
	})
})

$("#validActClic").on("click",(event) => {
	event.preventDefault()

	$.ajax({
		url: "/estimulation/found-children",
		async : false,
		data : $("#formAddChildAct").serialize(),
		type : "POST",
		success: function(result){
			if (result.err) return notification.show({msg:result.err.message, type:1})
			var clone = getClone("#consulQueryChildrenValidParcial")

			var data = $(clone.querySelector("#dataNameChildParcial"))

			var label = $("<label>",{html : "Identificación Niñ@: "}),
				input = $("<input>",{html : result.idChildren})
						.prop("type", "number")
						.attr({id:"idChildren"})
						.prop("readonly", true)
						.prop("name", "idChildren")
						.val(result.idChildren)

			$("#buttonCancelValidActParcial",clone).click(()=>{
				$("#formValidChildrenParcial").remove()
			})

			$("#buttonValidActParcial",clone).click(()=>{
				if(confirm("Validación parcial de actividad a: " + $("#idChildren").val() +". ¿Desea continuar?")){
					$.ajax({
						url: "/estimulation/valid-activity-parcial",
						async : false,
						data : {actGeneral : ($("#formValidChildrenParcial")).serialize(),
								stepActivity : $("#numberStep").val(),
								activityActivity : $("#numberActivity").val()},
						type : "POST",
						success: function(activity){
							if (activity.err) return notification.show({msg:activity.err.message, type:1})
							notification.show({msg:activity.msg, type:activity.statusCode})
							//console.log(activity)
						}
					})
					$("#formInicAct").remove()
					$("#nameChild").remove()
					$("#nameChild1").remove()
					$("#nameChild2").remove()
					$("#formValidChildrenParcial").remove()
					$("#idChildren").val("")
					$("#idChildren").prop("readonly", false)
					$("#numberPin").val("")
					$("#numberPin").prop("readonly", false)
					$("#validActClicDef").prop("disabled", true)
					$("#validActClic").prop("disabled", true)
				}
			})

			data.append(label)
			data.append(input)
			renderResultValid(clone)
		}
	})
})

$("#validActClicDef").on("click",(event) => {
	event.preventDefault()

	$.ajax({
		url: "/estimulation/found-children",
		async : false,
		data : $("#formAddChildAct").serialize(),
		type : "POST",
		success: function(result){

			var clone = getClone("#consulQueryChildrenValid"),

				data = $(clone.querySelector("#dataNameChild")),

				label = $("<label>",{html : "Identificación Niñ@: "}),
				input = $("<input>",{html : result.idChildren})
				.prop("type", "number")
				.attr({id:"idChildren"})
				.prop("readonly", true)
				.prop("name", "idChildren")
				.val(result.idChildren)

			$("#buttonCancelValidAct",clone).click(()=>{
				$("#formValidChildren").remove()
			})

			$("#buttonValidAct",clone).click(()=>{
				if(confirm("Validación DEFINITIVA de actividad a: " + $("#idChildren").val() +". ¿Desea continuar?")){
					$.ajax({
						url: "/estimulation/valid-activity-complete",
						async : false,
						data : {actGeneral : ($("#formValidChildren")).serialize(),
								stepActivity : $("#numberStep").val(),
								activityActivity : $("#numberActivity").val()},
						type : "POST",
						success: function(activity){
							if (activity.err) return notification.show({msg:activity.err.message, type:1})
							notification.show({msg:activity.msg, type:activity.statusCode})
							//console.log(activity)
						}
					})
					$("#formInicAct").remove()
					$("#nameChild").remove()
					$("#nameChild1").remove()
					$("#nameChild2").remove()
					$("#formValidChildren").remove()
					$("#idChildren").val("")
					$("#idChildren").prop("readonly", false)
					$("#numberPin").val("")
					$("#numberPin").prop("readonly", false)
					$("#validActClicDef").prop("disabled", true)
					$("#validActClic").prop("disabled", true)
				}
			})

			data.append(label)
			data.append(input)
			renderResultValid(clone)
		}
	})
})

$("#restarActClic").click(()=>{
	$("#formInicAct").remove()
	$("#nameChild").remove()
	$("#nameChild1").remove()
	$("#nameChild2").remove()
	$("#formValidChildren").remove()
	$("#idChildren").val("")
	$("#idChildren").prop("readonly", false)
	$("#numberPin").val("")
	$("#numberPin").prop("readonly", false)
	$("#validActClicDef").prop("disabled", true)
	$("#validActClic").prop("disabled", true)
})

$("#continueViewMore").click((event) => {
	var msg = "¡Consulta éxitosa! Resultados En la parte inferior",
		type = 0
	notification.show({msg:msg, type:type})
	var clone = getClone("#consulQueryDataChild")
	renderResultDataResult(clone)
})

$("#continueStepAll").click((event) => {
	var clone = getClone("#consulQueryDataActOne")
	renderResultDataResult(clone)
})

$("#continueActAll").click((event) => {
	var clone = getClone("#consulQueryDataActAll")
	var steps = $("#consulStep[data-step]",clone)

	$.ajax({
		url: "/estimulation/found-step",
		async : false,
		data : {idChildren : $("#idChildren").val()},
		type : "POST",
		success: function(result){
			steps.on("click" ,(e) => {
				e.stopPropagation()
				alert("aqui")
				$.ajax({
					url: "/estimulation/consul-step",
					async : false,
					data : {step : e.currentTarget.dataset.step,
							idChildren : $("#idChildren").val()},
					type : "POST",
					success: function(result){
						var clone = getClone("#consulQueryDataStepDetail"),
							data = $(clone.querySelector("#actsStepDetail")),
							num = Array.from(result.activities).length

						//console.log(Array.from(result.activities).length)

						resultStep = $("#resultStep")

						for (activity of Array.from(result.activities)){
							//console.log(1)
							var tr = $("<tr>").append(
								$("<td>",{html : num}),
								$("<td>",{html : activity.idActivity.nameActivity}),
								$("<td>",{html : funcStatusAct(activity.statusActivity)}),
								$("<td>",{html : activity.scoreTeachActivity}),
								$("<td>",{html : activity.scoreSystemActivity}),
								$("<td>",{html : activity.observationActivity}),
								$("<td>",{html : activity.idTeacher.nameUser}),
								$("<td>",{html : activity.date})
							)
							$(data).append(tr)
							//console.log(data)
							num = num - 1
						}
						renderResultDataStep(clone)
					}
				})
			})
		}
	})

	renderResultDataResult(clone)
})
	

