google.charts.load("current", {packages: ["corechart", "bar"]})

var notification = new NotificationC()

/*
	Informacion Detallada
	Manejo de Tabs para la muestra de informacion detallada de un niñ@
	Route /reports/info-children/:id
*/
$(".headerTab").on("click",function() {
	$(".contentTab").addClass("hide")
	$($(this).data("ref")).removeClass("hide")
	var fnString = $(this).data("function")
	if(fnString) eval(fnString)()
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


/////////////******************* luzma hizo ---- revisar
/*
	Crear select de actividades
	form#formConsulActStepsReport
	Si sucede un evento chage en el select de etapas (#consulActStep), se genera otro select (#consulAct) con sus actividades correspondientes.
	Resquest POST /api/:collection
*/
$("#consulActStep").change(() => {
	$.ajax({
		url: "/api/activity",
		type : "POST",
		contentType: "application/json",
		data : JSON.stringify({
			query:{
				stepActivity : $("#consulActStep").val()
			}
		}),
		success: function(respose){
			$("#consulAct").empty()
			if(respose.documents.length){
				for(var activity of respose.documents){
					$("#consulAct ").append(
						$("<option>",{
							html: "Actividad: " + activity.activityActivity + " - " + activity.nameActivity,
							value: activity.activityActivity})
					)
				}
			}
		}
	})
})

function drawChartStep(){

	var steps = dataTemplate.stepsValid
	var data = steps.map(element => {return [element.idStep.nameStep,element.scoreStep]})

	var headerChart = [["Etapa", "Puntaje"]],
		dataChart = headerChart.concat(data)

	var data = google.visualization.arrayToDataTable(dataChart)

	var options = {
		title: "Avance Por Etapas",
		chartArea: {width: "50%"},
		"fill-color":"black",
		hAxis: {
			title: "Puntaje",
			minValue: 0
		},
		vAxis: {
			title: "Etapas",
			minValue: 0
		}
	}

	var chart = new google.visualization.BarChart(document.getElementById("containerChart"))

	chart.draw(data, options)
}
function drawChartActvityValid(){

	var activitiesValid = dataTemplate.activitiesValid
	var data = activitiesValid.map(
		element => {
			return [
				element.idActivity.nameActivity + " - " + element.idStep.nameStep,
				element.scoreTeachActivity,
				element.scoreSystemActivity]
			})

	var headerChart = [["Actividad", "Puntaje Docente", "Puntaje Sistema"]],
		dataChart = headerChart.concat(data)

	var data = google.visualization.arrayToDataTable(dataChart)

	var options = {
		title: "Avance por Actividades",
		chartArea: {width: "50%"},
		hAxis: {
			title: "Puntaje",
			minValue: 0,
			textStyle: {
				bold: true,
				fontSize: 12,
				color: "#4d4d4d"
			},
			titleTextStyle: {
				bold: true,
				fontSize: 18,
				color: "#4d4d4d"
			}
		},
		vAxis: {
			title: "Actividad",
			textStyle: {
				fontSize: 14,
				bold: true,
				color: "#848484"
			},
			titleTextStyle: {
				fontSize: 14,
				bold: true,
				color: "#848484"
			}
		}
	}
	var chart = new google.visualization.BarChart(document.getElementById("containerChart"))
	chart.draw(data, options)
}

function drawChartActivityHistory(){

	var dataGeneral = {}

	var headerChart = [["Fecha", "Puntaje Docente", "Puntaje Sistema"]]

	dataTemplate.histories.forEach(element => {
		if(!dataGeneral[element.idActivity.stepActivity]) dataGeneral[element.idActivity.stepActivity] = []
		dataGeneral[element.idActivity.stepActivity].push({history:element})
	})
	for (var hs in dataGeneral){
		dataGeneral[hs].data = []
		dataGeneral[hs].forEach(element => {
			element.data = [element.history.date,element.history.scoreTeachActivity,element.history.scoreSystemActivity]
			dataGeneral[hs].data.push([element.history.date,element.history.scoreTeachActivity,element.history.scoreSystemActivity])

		})
	}
	console.log(dataGeneral)

	var data = google.visualization.arrayToDataTable([
		["Fecha", "Puntaje Profe", "Puntaje Sistema"],
		["2016-07-04",  3,5],
		["2016-07-09",  7,4],
		["2016-07-20",  10,8]
	])

	var options = {
		title: "Hitorial de Actividades",
		hAxis: {title: "Fecha",  titleTextStyle: {color: "#333"}},
		vAxis: {title: "Puntaje", minValue: 0}
	}

	var chart = new google.visualization.AreaChart(document.getElementById("containerChart"));
	chart.draw(data, options)
}
