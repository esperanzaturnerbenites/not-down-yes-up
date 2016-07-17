var formAddChildAct = $("#formAddChildAct"),
	showChildrensCont = $("#showChildrensCont"),
	activityChildrens = $("#activityChildrens"),
	showValidAct = $("#showValidAct"),
	results = $("#results"),
	resultStepActs = $("#resultStepActs"),
	notification = new NotificationC()

function getClone(selector){
	var t = document.querySelector(selector)
	return document.importNode(t.content,true)
}

function renderResults(node){showChildrensCont.html(""); showChildrensCont.append(node)}
function renderResultAct(node){activityChildrens.html(""); activityChildrens.append(node)}
function renderResultValid(node){showValidAct.html(""); showValidAct.append(node)}
function renderResultDataResult(node){results.html(""); results.append(node)}
function renderResultDataStep(node){resultStepActs.html(""); resultStepActs.append(node)}



function funcStatusAct(status){
	var statusText = ""
	if(status == 0)
		statusText = "No Completado"
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
				if(childrens.statusChildren == 3){
					notification.show({msg:"¡Niñ@ Retirado. No puede realizar actividades!", type:2})
				} else {
					var clone = getClone("#consulQueryAddChild"),
						cloneAct = getClone("#consulQueryActivityChild")
					var data = $(clone.querySelector("#showChildrens")),
						dataAct = $(clone.querySelector("#activityChildrens"))

					var pName = $("<p>").attr({id:childrens.idChildren}).append(
							$("<span>",{html : "Nombre: " +  childrens.nameChildren + " " + childrens.lastnameChildren})
						),
						pId = $("<p>").attr({id:childrens.idChildren}).append(
							$("<span>",{html :  "ID: " + childrens.idChildren})
						),
						imgChild = $("<article>",{class : "imgPhoto"}).append(
							$("<img>",{src:"/img/users/"+childrens.imgChildren})
							).click(() => {
								window.open("/estimulation/infoChildren/" + $("#idChildren").val())
							})//,
						//button = $("<button>")
							//.attr("id","infoChildren")
							//.attr("type","button")
							//.click(() => {
							//	window.open("/estimulation/infoChildren/" + $("#idChildren").val())
							//})
							//.append($("<span>", {html : "Info: " + childrens.nameChildren}))
					data.append(pName,pId, imgChild)

					$("#cancelAddChildren",clone).click(()=>{
						$("#formValidChildren").remove()
						$("#formInicAct").remove()
						$("#nameChild").remove()
						$("#nameChild1").remove()
						$("#nameChild2").remove()
						$("#fieldsetGuide").remove()
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

					$("#connectRug").click(function(){
						$.ajax({
							url: "/estimulation/arduino/connect",
							async : true,
							type : "POST",
							data : {numberPin : $("#numberPin").val()},
							success: response => {
								notification.show({msg:response.message, type:response.statusCode})
							}
						})
					})
					$("#disconnectRug").click(function(){
						$.ajax({
							url: "/estimulation/arduino/disconnect",
							async : true,
							type : "POST",
							success: response => {
								notification.show({msg:response.message, type:response.statusCode})
							}
						})
					})
					$("#review").click((event) => {
						event.preventDefault
						$("#reviewChild").toggleClass("hide")

					})
				}
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
							location.reload(true)
						}
					})
					/*$("#formInicAct").remove()
					$("#nameChild").remove()
					$("#nameChild1").remove()
					$("#nameChild2").remove()
					$("#formValidChildrenParcial").remove()
					$("#fieldsetGuide").remove()
					$("#idChildren").val("")
					$("#idChildren").prop("readonly", false)
					$("#numberPin").val("")
					$("#numberPin").prop("readonly", false)
					$("#validActClicDef").prop("disabled", true)
					$("#validActClic").prop("disabled", true)*/

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
							location.reload(true)
						}
					})
					/*$("#formInicAct").remove()
					$("#nameChild").remove()
					$("#nameChild1").remove()
					$("#nameChild2").remove()
					$("#formValidChildren").remove()
					$("#fieldsetGuide").remove()
					$("#idChildren").val("")
					$("#idChildren").prop("readonly", false)
					$("#numberPin").val("")
					$("#numberPin").prop("readonly", false)
					$("#validActClicDef").prop("disabled", true)
					$("#validActClic").prop("disabled", true)*/
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
	$("#fieldsetGuide").remove()
	$("#idChildren").val("")
	$("#idChildren").prop("readonly", false)
	$("#numberPin").val("")
	$("#numberPin").prop("readonly", false)
	$("#validActClicDef").prop("disabled", true)
	$("#validActClic").prop("disabled", true)
})

$("#continueViewMore").click(() => {
	var msg = "¡Consulta éxitosa! Resultados En la parte inferior",
		type = 0
	notification.show({msg:msg, type:type})
	resultStepActs.empty()
	var clone = getClone("#consulQueryDataChild")
	renderResultDataResult(clone)
})

$("#continueStepAll").click(() => {
	var msg = "¡Consulta éxitosa! Resultados En la parte inferior",
		type = 0
	resultStepActs.empty()
	notification.show({msg:msg, type:type})
	var clone = getClone("#consulQueryDataActOne")
	renderResultDataResult(clone)
})

$("#continueActAll").click((event) => {
	event.preventDefault
	var clone = getClone("#consulQueryDataActAll")

	resultStepActs.empty()

	$.ajax({
		url: "/estimulation/found-step",
		async : false,
		data : {idChildren : $("#idChildren").val()},
		type : "POST",
		success: function(result){
			var dataConsul = $(clone.querySelector("#buttonSteps"))

			for(var step of result.steps){
				var status = ""
				if(step.statusStep == 0)
					status = "No Completada"
				else
					status = "Completada"
				var tr =$("<tr>").append(
					$("<th>").append(
						$("<button>", {
							html : "Etapa " + step.idStep.stepStep,
							type : "button",
							id : "consulStep",
							"data-step" : step.idStep.stepStep
						}).prepend(
							$("<img>", {src : "/img/check.png"})
						)
						),
					$("<td>", {html : status})
					)
				dataConsul.append(tr)
			}

			var steps = $("#consulStep[data-step]",clone) 

			steps.on("click" ,(e) => {
				e.stopPropagation()
				
				$.ajax({
					url: "/estimulation/consul-step",
					async : false,
					data : {step : e.currentTarget.dataset.step,
							idChildren : $("#idChildren").val()},
					type : "POST",
					success: function(result){
						var msg = "¡Consulta éxitosa! Resultados En la parte inferior",
							type = 0
						resultStepActs.empty()
						notification.show({msg:msg, type:type})
						
						var cloneA = getClone("#consulQueryDataStepDetail"),
							dataClone = $(cloneA.querySelector("#tableActsStepDetail")),
							num = result.data.activities.length

						//resultStep = $("#resultStep")
						if(num > 0){
							$("#stepDetailS", cloneA).append(
								$("<b>", {html : "Etapa " + result.data.activities[0].idActivity.stepActivity})
								)
							for (var activity of result.data.activities){
								var tr = $("<tr>").append(
									$("<td>",{html : num}),
									$("<td>",{html : activity.idActivity.nameActivity}),
									$("<td>",{html : funcStatusAct(activity.statusActivity)}),
									$("<td>",{html : activity.scoreTeachActivity}),
									$("<td>",{html : activity.scoreSystemActivity}),
									$("<td>",{html : activity.observationActivity}),
									$("<td>",{html : activity.idUser.userUser}),
									$("<td>",{html : activity.date})
								)
								num = num - 1
								dataClone.append(tr)
							}
							
						}
						renderResultDataStep(cloneA)
					}
				})
			})
		}
	})
	renderResultDataResult(clone)
})

$("#audioPrinc").prop("volume", 0.1)
$("#audioPrinc").trigger("play")

var socket = io.connect("http://localhost:8000/")
socket.on("response", function (data) {
	notification.show({msg:data.message, type:data.statusCode})
})
socket.on("changeStatusRug", function (data) {
	$("#statusRug").html(data.statusText)
})