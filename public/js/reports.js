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

var showResultsReport = $("#showResultsReport"),
	consulAct = $("#consulAct")

var notification = new NotificationC()

function getClone(selector){
	var t = document.querySelector(selector)
	//var t = document.querySelector("#consulQueryGeneralAvanced")
	return clone = document.importNode(t.content,true)
}

function renderResultStep(node){ showResultsReport.html(""); showResultsReport.append(node)}
function renderResultsReport(node){ showResultsReport.html(""); showResultsReport.append(node)}

function genderChild(gender){
	var genderText = ""
	if(gender == 0)
		genderText = "Niña"
	if(gender == 1)
		genderText = "Niño"
	return genderText
}

$("#buttonReportSteps").on("click", () => {
	event.preventDefault()
	$.ajax({
		url: "/reports/consul-step",
		async : false, 
		type : "POST",
		data : $("#consulStep").serialize(),
		success: function(result){
			var steps = result.steps.step,
				actsV = result.steps.actsval,
				contActs = actsV.length,
				info = result.steps.stepval,
				clone = getClone("#consulQueryResults"),
				data = $(clone.querySelector("#resultStepTable")),
				dataInfo = $(clone.querySelector("#actsVal"))

			clone.querySelector("#numberStepResult").innerHTML = "ETAPA " + steps.stepStep
			clone.querySelector("#nameStepResult").innerHTML = steps.nameStep
			clone.querySelector("#descriptionStepResult").innerHTML = steps.descriptionStep
			//console.log(result.stepStep)

			console.log(contActs)

			for(var a = 1; a <= result.steps.numact; a++){
				var th = $("<th>",{html : "ACT " + a})
				dataInfo.append(th)
			}

			for(var children of info){
				if(actsV.length )
				var tr = $("<tr>").append(
						td = $("<td>",{html : children.idChildren.nameChildren + " " + children.idChildren.lastnameChildren}),
						td = $("<td>",{html : children.idChildren.ageChildren}),
						td = $("<td>",{html : children.statusStep}))
				data.append(tr)
			}
			renderResultStep(clone)

		}
	})
})

$("#consulG").change(() => {
	$.ajax({
		url: "/reports/general",
		async : false, 
		type : "POST",
		success: function(result){
			console.log(result)
			var steps = result.info.stepvalid,
				actsvalid = result.info.actvalid,
				actshis = result.info.acthistory

			if($("#consulG").val() == 0){
				var clone = getClone("#consulQueryGeneralAvanced"),
					data = $(clone.querySelector("#data"))

				for(var step of steps){
					//Preguntar si el idChildren =! del idChidren anterior, despues de la 
					//primera iteracion.
					var tr = $("<tr>").append(
						$("<td>",{html : step.idChildren.idChildren}),
						$("<td>",{html : step.idChildren.nameChildren + " " + step.idChildren.lastnameChildren}),
						$("<td>",{html : step.idChildren.ageChildren}),
						//Hacer un for y dentro de el
						//preguntar si step.idChildren = step.idChildren
						//y si step.stepStep = N° Step
						$("<td>",{html : step.statusStep}),
						$("<td>",{html : step.statusStep}),
						$("<td>",{html : step.statusStep}),
						$("<td>",{html : step.statusStep}),
						$("<td>",{html : step.date})
					)
					data.append(tr)
				}
				renderResultsReport(clone)

			}else if($("#consulG").val() == 1){
				var clone = getClone("#consulQueryAgeStep"),
					dataAgeStep = $(clone.querySelector("#dataAgeStep"))

				for(var step of steps){
					//Preguntar etpas 1, 2, 3 o 4
					var tr = $("<tr>").append(
						$("<td>", {html : step.idChildren.nameChildren})
					)
					dataAgeStep.append(tr)
				}
				renderResultsReport(clone)

			}else if($("#consulG").val() == 2){
				clone = getClone("#consulQueryResults")
				dataResultStep1 = $(clone.querySelector("#dataResultStep1"))
				dataResultStep2 = $(clone.querySelector("#dataResultStep2"))
				dataResultStep3 = $(clone.querySelector("#dataResultStep3"))
				dataResultStep4 = $(clone.querySelector("#dataResultStep4"))

				renderResultsReport(clone)

			}
		}
	})
})

$("#consulAge").change(() => {
	if($("#consulAge").val() >= 0 && $("#consulAge").val() < 3){
		$("#consulIdConsulAvanced2Label").addClass("hide")
		$("#consulIdConsulAvanced2").addClass("hide")
	}else if($("#consulAge").val() == 3){
		$("#consulIdConsulAvanced2Label").removeClass("hide")
		$("#consulIdConsulAvanced2").removeClass("hide")
	}
	$.ajax({
		url: "/reports/general",
		async : false,
		data : $("#ageConsul").serialize(),
		type : "POST",
		success: function(result){
			var childrens = result.childrens,
				steps = result.steps

			if($("#consulAge").val() == 0){
				var clone = getClone("#consulQueryGeneralAvanced"),
					data = $(clone.querySelector("#data"))

				for(var children of childrens){
					//Preguntar si el idChildren =! del idChidren anterior, despues de la 
					//primera iteracion.
					var tr = $("<tr>").append(
						$("<td>",{html : children.idChildren.idChildren}),
						$("<td>",{html : children.idChildren.nameChildren + " " + children.idChildren.lastnameChildren}),
						$("<td>",{html : children.idChildren.ageChildren}),
						//Hacer un for y dentro de el
						//preguntar si children.idChildren = step.idChildren
						//y si step.stepStep = N° Step
						$("<td>",{html : steps[0].statusStep}),
						$("<td>",{html : steps[0].statusStep}),
						$("<td>",{html : steps[0].statusStep}),
						$("<td>",{html : steps[0].statusStep}),
						$("<td>",{html : children.date})
					)
					data.append(tr)
				}
				renderResultsReport(clone)

			}else if($("#consulAge").val() == 1){
				var clone = getClone("#consulQueryAgeStep"),
					dataAgeStep = $(clone.querySelector("#dataAgeStep"))

				for(var step of steps){
					//Preguntar etpas 1, 2, 3 o 4
					var tr = $("<tr>").append(
						$("<td>", {html : step.idChildren.nameChildren})
					)
					dataAgeStep.append(tr)
				}
				renderResultsReport(clone)

			}else if($("#consulAge").val() == 2){
				var clone = getClone("#consulQueryResults"),
				dataResultStep1 = $(clone.querySelector("#dataResultStep1"))
				dataResultStep2 = $(clone.querySelector("#dataResultStep2"))
				dataResultStep3 = $(clone.querySelector("#dataResultStep3"))
				dataResultStep4 = $(clone.querySelector("#dataResultStep4"))

				renderResultsReport(clone)

			}
		}
	})
})

$("#consulActStep").change(() => {
	var step = {stepStep:$("#consulActStep").val()}
	$.ajax({
		url: "/reports/consul-step-acts",
		async : false,
		data : step,
		type : "POST",
		success: function(result){
			$("#consulAct").empty()
			if(result.steps){
				for(step of result.steps){
					$("#consulAct").append(
						$("<option>",{
							html: "Actividad: " + step.activityActivity + " - " + step.nameActivity,
							value: step.activityActivity})
					)
				}
			}
		}
	})
})

$("#buttonConsulIdChildrenx").click((event) => {
	event.preventDefault()

	$.ajax({
		url: "/reports/found-childrens",
		async : false, 
		data : $("#idChildren").serialize(),
		type : "POST",
		success: function(result){
			if (result.err) return notification.show({msg:result.err.message, type:1})
			notification.show({msg:result.msg, type:result.statusCode})
			if(result._id){
				window.open("/reports/info-children/" + $("#idChildren").val())
			}
		}
	})
})

$("#menuInfoOpc1").on("click",() => {
	$("#info1").removeClass("hide")
	$("#info2").addClass("hide")
	$("#info3").addClass("hide")
	$("#info4").addClass("hide")
	$("#info5").addClass("hide")
})

$("#menuInfoOpc2").on("click",() => {
	$("#info1").addClass("hide")
	$("#info2").removeClass("hide")
	$("#info3").addClass("hide")
	$("#info4").addClass("hide")
	$("#info5").addClass("hide")
})

$("#menuInfoOpc3").on("click",() => {
	$("#info1").addClass("hide")
	$("#info2").addClass("hide")
	$("#info3").removeClass("hide")
	$("#info4").addClass("hide")
	$("#info5").addClass("hide")
})

$("#menuInfoOpc4").on("click",() => {
	$("#info1").addClass("hide")
	$("#info2").addClass("hide")
	$("#info3").addClass("hide")
	$("#info4").removeClass("hide")
	$("#info5").addClass("hide")
})

$("#menuInfoOpc5").on("click",() => {
	$("#info1").addClass("hide")
	$("#info2").addClass("hide")
	$("#info3").addClass("hide")
	$("#info4").addClass("hide")
	$("#info5").removeClass("hide")
})

/*
$("#buttonConsulIdChildren").click((event) => {
	var clone = getClone("#consulQueryChildren")
	renderResultsReport(clone)
	event.preventDefault()

	$.ajax({
		url: "/reports/children",
		async : false, 
		data : $("#consulChildren").serialize(),
		type : "POST",
		success: function(result){
			if(result.err) return result.err
			var children = result.children
			console.log(children._id)

		}
	})
})*/