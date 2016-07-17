var notification = new NotificationC()

/*
	Informacion Detallada
	Manejo de Tabs para la muestra de informacion detallada de un niñ@
	Route /reports/info-children/:id
*/
$(".headerTab").on("click",function() {
	$(".contentTab").addClass("hide")
	$($(this).data("ref")).removeClass("hide")
})

/*
	Consultas Generales
	Genera una Serie de Consultas Generales
		0 - Listado General Niñ@s: Listado de Niñ@s
		1 - Listado General Profesores: Listado de Profesores
		2 - Listado por Etapas: Listado de Niñ@s por Etapas
	Request POST /reports/general
*/
$("#consultGeneral").submit(function (event) {
	event.preventDefault()
	$.ajax({
		url: "/reports/general",
		type : "POST",
		data : $(this).serialize(),
		success: function(response){
			window.response = response
			$("#showResultsReport").html(response.html)
			$("#showResultsReport")[0].scrollIntoView()
		}
	})
})

/*
	Consulta Por Edades
	form#ageConsul
	Retorna los nin@s que cumplan con la condicion de edad establecida
	Request POST /api/:collection
*/
$("#ageConsul").submit(function (event) {
	event.preventDefault()

	var operator = "$" + $("#consulAge").val(),
		data = {query:{ageChildren : {}}}

	data.query.ageChildren[operator] = $("#consulIdConsulAvanced").val()
	data.fn = "renderReportAge"
	data.params = {
		view: "views/reports/listChildren.jade",
		data: []
	}

	$.ajax({
		url: "/api/children",
		type : "POST",
		contentType: "application/json",
		data : JSON.stringify(data),
		success: function(response){
			console.log(response)
			$("#showResultsReport").html(response.returnFn)
			$("#showResultsReport")[0].scrollIntoView()
		}
	})
})

/*
	Detalle Informacion niñ@
	form#consulChildren
	Si el niñ@ existe abre una nueva pestaña con la informacion detallada del niñ@ (GET /info-children/:id)
	Resquest POST /api/:collection
*/
$("#consulChildren").submit((event) => {
	event.preventDefault()

	$.ajax({
		url: "/api/children",
		type : "POST",
		contentType: "application/json",
		data : JSON.stringify({
			query:{
				idChildren : $("#idChildren").val()
			}
		}),
		success: function(respose){
			if(respose.documents.length){
				window.open("/reports/info-children/" + $("#idChildren").val())
			}else{
				notification.show({msg:"El Niñ@ no existe.", type:CTE.STATUS.NOT_OK})
			}
		}
	})
})

/*
	Consulta por Etapas
	form#formConsulStep
	Consulta todos niñ@s que se encuentran en una etapa determinada
	Resquest POST /reports/consult-step-act
*/
/*
	Consulta por Actividad
	form#formConsulActStepsReport
	Consulta todos niñ@s que se encuentran en una actividad determinada
	Resquest POST /reports/consult-step-act
*/
$("#formConsulStep,#formConsulActStepsReport").submit(function(event){
	event.preventDefault()

	$.ajax({
		url: "/reports/consult-step-act",
		type : "POST",
		data : $(this).serialize(),
		success: function(result){
			$("#showResultsReport").html(result.html)
			$("#showResultsReport")[0].scrollIntoView()
		}
	})
})