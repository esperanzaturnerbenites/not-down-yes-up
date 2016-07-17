var notification = new NotificationC()

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
		success: function(response){$("#showResultsReport").html(response.html)}
	})
})

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
	Consulta Por Edades
	form#ageConsul
	Retorna los nin@s que cumplan con la condicion de edad establecida
	Request POST /api/:collection
*/
$("#ageConsul").submit(function (event) {
	event.preventDefault()
	var operator = "$" + $("#consulAge").val()
	var data = {
		query:{
			ageChildren : {}
		}
	}
	data.query.ageChildren[operator] = $("#consulIdConsulAvanced").val()
	$.ajax({
		url: "/api/children",
		type : "POST",
		contentType: "application/json",
		data : JSON.stringify(data),
		success: function(respose){
			console.log(respose)
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
		success: function(children){
			if(children.length){
				window.open("/reports/info-children/" + $("#idChildren").val())
			}else{
				notification.show({msg:"El Niñ@ no existe.", type:CTE.STATUS.NOT_OK})
			}
		}
	})
})

/*
	Consulta por Etapas
	form#consulChildren
	Consulta todos niñ@s que se encuentran en una etapa determinada
	Resquest POST /reports/consult-step-act
*/
$("#formConsulStep").submit(function(event){
	event.preventDefault()
	$.ajax({
		url: "/reports/consult-step-act",
		type : "POST",
		data : $(this).serialize(),
		success: function(result){$("#showResultsReport").html(result.html)}
	})
})

/*
	Consulta por Actividad
	form#consulChildren
	Consulta todos niñ@s que se encuentran en una actividad determinada
	Resquest POST /reports/consult-step-act
*/
$("#formConsulActStepsReport").submit(function(event){
	event.preventDefault()
	$.ajax({
		url: "/reports/consult-step-act",
		type : "POST",
		data : $(this).serialize(),
		success: function(result){$("#showResultsReport").html(result.html)}
	})
})
