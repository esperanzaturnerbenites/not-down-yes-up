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
		url: "/estimulation/valid-activity",
		data: {
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
		type : "POST",
		success: function(response){
			$("#formValidateFinalActivity").trigger("reset")
			$("#formValidateFinalActivity").addClass("hide")
			if(response.documents) return notification.show({msg:"Validacion Definitiva Correcta",type:CTE.STATUS_CODE.OK})
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
			},
			fn:"updateStatusChildrenEstimulation",
			params:{
				"idChildren": j_childrenCurrent._id,
				"statusChildrenEstimulation": CTE.STATUS_ESTIMULATION.IN_PROGRESS
			}
		}),
		type : "POST",
		success: function(response){
			$("#formValidatePartialActivity").trigger("reset")
			$("#formValidatePartialActivity").addClass("hide")
			if(response) return notification.show({msg:"Validacion Parcial Correcta",type:CTE.STATUS_CODE.OK})
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

socket.on("arduino:data", function (data) {
	var scoreSystemActivity = CTE.MIN_SCORE_SYSTEM,
		srcImage = "/img/imgacts/activities/sad.png"
	if(data.statusCode == CTE.STATUS_CODE.OK){
		scoreSystemActivity = CTE.MAX_SCORE_SYSTEM
		srcImage = "/img/imgacts/activities/smile.png"
	}
	if(data.isCorrect) $("#aswerAct audio").trigger("play")
	$("#aswerAct").removeClass("hide")
	$("#aswerAct #scoreSystemActivity").val(scoreSystemActivity)
	$("#aswerAct img").attr("src",srcImage)
	$("[name=scoreSystemActivity]").val(scoreSystemActivity)
	notification.show({msg:data.message, type:data.statusCode})
})

//-----------------------------------//

function getClone(selector){
	var t = document.querySelector(selector)
	return document.importNode(t.content,true)
}

function renderResultDataResult(node){$("#results").html(""); $("#results").append(node)}
function renderResultDataStep(node){$("#resultStepActs").html(""); $("#resultStepActs").append(node)}

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

$("[name=scoreSystemActivity]").val(CTE.MIN_SCORE_SYSTEM)