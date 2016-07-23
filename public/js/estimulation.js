$("#startActivity").submit(function(event){
	event.preventDefault()
	$.ajax({
		url: "/estimulation/startActivity",
		async : false,
		data : {
			idChildren: $("#idChildren").val(),
			idActivity: j_activityCurrent.activityActivity,
			idStep: j_activityCurrent.stepActivity
		},
		type : "POST",
		success: function(response){
			$("#contentActivity").html(response.html)
			$("#validatePartialActivity,#validateFinalActivity").attr("disabled",false)
			
			$("#review").click(activityReview)

			$("#validatePartialActivity").click(showFormValidatePartialActivity)
			$("#validateFinalActivity").click(showFormValidateFinalActivity)

			$("#formValidateFinalActivity").submit(validateFinalActivity)
			$("#formValidatePartialActivity").submit(validatePartialActivity)
		}
	})
})

/* Creo o Actualizar */
/* Actualizar el estado de estimulacion del niñ@ -> 1 */
function validateFinalActivity(event){
	event.preventDefault()
	$.ajax({
		url: "/api/new/activityvalid",
		contentType: "application/json",
		data : JSON.stringify({
			info: {
				statusActivity: $("#statusActivity",$(this)).val(),
				scoreSystemActivity: $("#scoreSystemActivity",$(this)).val(),
				scoreTeachActivity: $("#scoreTeachActivity",$(this)).val(),
				backingMaxActivity: $("#backingMaxActivity",$(this)).val(),
				backingMinActivity: $("#backingMinActivity",$(this)).val(),
				backingDFunctionActivity: $("#backingDFunctionActivity",$(this)).val(),
				observationActivity: $("#observationActivity",$(this)).val(),
				idActivity: j_activityCurrent._id,
				idStep: j_stepCurrent._id,
				idUser: j_userCurrent._id,
				idChildren: j_childrenCurrent._id
			},
			fn:"checkCountActivities",
			params:{
				idChildren: j_childrenCurrent._id,
				idActivity: j_activityCurrent._id,
				idStep: j_stepCurrent._id
			}
		}),
		type : "POST",
		success: function(response){
			console.log(response)
		}
	})
}

/* Actualizar el estado de estimulacion del niñ@ -> 1 */
function validatePartialActivity(event){
	event.preventDefault()
	$.ajax({
		url: "/api/new/activityhistory",
		contentType: "application/json",
		data : JSON.stringify({
			info: {
				statusActivity: $("#statusActivity",$(this)).val(),
				scoreSystemActivity: $("#scoreSystemActivity",$(this)).val(),
				scoreTeachActivity: $("#scoreTeachActivity",$(this)).val(),
				observationActivity: $("#observationActivity",$(this)).val(),
				idActivity: j_activityCurrent._id,
				idStep: j_stepCurrent._id,
				idUser: j_userCurrent._id,
				idChildren: j_childrenCurrent._id
			}
		}),
		type : "POST",
		success: function(response){
			console.log(response)
		}
	})

}

function activityReview(){
	$("#reviewChild").toggleClass("hide")
}

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

// continueViewMore -> viewInforChildren
// continueActAll ->  viewHistoryActivities
// continueStepAll -> viewValidsActivities

// InformacionChildren
$(".viewMore").click(function(){
	var typeReport = $(this).data("type-data")
	$.ajax({
		url: "/estimulation/info-children/view-more",
		data: {
			typeReport: typeReport,
			idChildren: j_currentChildren._id
		},
		type : "POST",
		success: function(response){
			console.log(response)
			$("#resultViewMore").html(response.html)
		}
	})
})
$("#viewInforChildren").click(() => {})

// HistorialActividades
$("#viewHistoryActivities").click(() => {})

// actividades validadas
$("#viewValidsActivities").click(() => {})

$("#continueViewMore").click(() => {
	var msg = "¡Consulta éxitosa!",
		type = 0
	$("#results")[0].scrollIntoView()
	notification.show({msg:msg, type:type})
	$("#resultStepActs").empty()
	var clone = getClone("#consulQueryDataChild")
	renderResultDataResult(clone)
})