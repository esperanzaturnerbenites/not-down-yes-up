$("#startActivity").submit(function(event){
	event.preventDefault()
	$.ajax({
		url: "/estimulation/startActivity",
		async : false,
		data : {
			idChildren: $("#idChildren").val(),
			idActivity: activityCurrent.activityActivity,
			idStep: activityCurrent.stepActivity
		},
		type : "POST",
		success: function(response){
			$("#contentActivity").html(response.html)
			$("#validatePartialActivity,#validateFinalActivity").attr("disabled",false)

			$("#validatePartialActivity").click(showFormValidatePartialActivity)
			$("#validateFinalActivity").click(showFormValidateFinalActivity)
		}
	})
})

function showFormValidatePartialActivity(){
	$("#formValidatePartialActivity").toggleClass("hide")
	$("#formValidateFinalActivity").addClass("hide")
}

function showFormValidateFinalActivity(){
	$("#formValidatePartialActivity").addClass("hide")
	$("#formValidateFinalActivity").toggleClass("hide")
}

$("#audioPrinc").prop("volume", 0.1)
$("#audioPrinc").trigger("play")

//var socket = io.connect("http://192.168.0.3:8000/")
var socket = io.connect()

var room = $("input[name=idUserAuthenticate]").val()

socket.on("connect", function() {
	socket.emit("room", room)
})

socket.on("message", function(data) {
	console.log("Message:", data)
})

socket.on("response", function (data) {
	notification.show({msg:data.message, type:data.statusCode})
})

//-----------------------------------//

function getClone(selector){
	var t = document.querySelector(selector)
	return document.importNode(t.content,true)
}

function renderResultDataResult(node){$("#results").html(""); $("#results").append(node)}
function renderResultDataStep(node){$("#resultStepActs").html(""); $("#resultStepActs").append(node)}

function funcStatusAct(status){
	var statusText = ""
	if(status == 0)
		statusText = "No Completado"
	if(status == 1)
		statusText = "Completado"
	return statusText
}

$("#continueViewMore").click(() => {
	var msg = "¡Consulta éxitosa!",
		type = 0
	$("#results")[0].scrollIntoView()
	notification.show({msg:msg, type:type})
	$("#resultStepActs").empty()
	var clone = getClone("#consulQueryDataChild")
	renderResultDataResult(clone)
})

$("#continueActAll").click((event) => {
	event.preventDefault
	var clone = getClone("#consulQueryDataActAll")

	$("#resultStepActs").empty()

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
						var msg = "¡Consulta éxitosa!",
							type = 0
						$("#resultStepActs").empty()
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
						$("#results")[0].scrollIntoView()
					}
				})
			})
		}
	})
	renderResultDataResult(clone)
	$("#results")[0].scrollIntoView()
})

$("#continueStepAll").click(() => {
	var msg = "¡Consulta éxitosa!",
		type = 0
	$("#resultStepActs").empty()
	notification.show({msg:msg, type:type})
	var clone = getClone("#consulQueryDataActOne")
	renderResultDataResult(clone)
	$("#results")[0].scrollIntoView()
})
