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

$("#clicShowAct").on("click",() => {
	$("#showAtc").removeClass("hide")
	$("#add").addClass("hide")
	$("#edit").addClass("hide")
	$("#delete").addClass("hide")
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

$("[data-id = ulPcpal]" ).hover(
	function() {
		var selector = $(this).data("reference")
		if(selector){
			$(selector).children().addClass("hide")
			var time = 100
			$(selector).removeClass("hide")
			$(selector).children().toArray().forEach(function(item){
				window.setTimeout(function(){$(item).removeClass("hide")},time)
				time += 50
			})
		}
	},
	function() {
		var selector = $(this).data("reference")
		if(selector){
			$(selector).addClass("hide")
			$(selector).children().toArray().forEach(function(item){
				$(item).addClass("hide")
			})
		}
	}
)

$("[data-id = admest]").on("click", function() {
	var selector = $(this).data("reference")
	$(".menuDesc").addClass("hide")
	if(selector){
		$(selector).removeClass("hide")
	}
})

$("[data-id = question]").on("click", function() {
	$(".menuHelpQuestion").addClass("hide")
	var selector = $(this).data("reference")
	if(selector){
		$(selector).removeClass("hide")
	}
})