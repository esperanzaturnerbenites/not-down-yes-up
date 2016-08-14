google.charts.load("current", {packages: ["corechart", "bar","calendar"]})

var notification = new NotificationC(),
	/*Variable de reasigna cuando se consulta el reporte de childrens to teacher*/
	dataToChartChildrenToTeacher = false

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
	Request POST /reports/children
*/
$("#consultGeneralChildrens").submit(function (event) {
	event.preventDefault()

	var data = {query:{}}

	if($("#statusChildren").val() != "T") data.query.statusChildren = $("#statusChildren").val()
	if(data.query.statusChildren == CTE.STATUS_USER.ACTIVE) {
		if($("#statusChildrenEstimulation").val() != "T")
			data.query.statusChildrenEstimulation = $("#statusChildrenEstimulation").val()
	}


	data.fn = "renderReportAge"
	data.params = {
		view: "views/reports/listChildren.jade",
		query: data.query
	}

	$.ajax({
		url: "/api/children",
		type : "POST",
		contentType: "application/json",
		data : JSON.stringify(data),
		success: showReportResult
	})
})

$("#consultGeneralTeachers").submit(function (event) {
	event.preventDefault()

	var data = {query:{}}

	data.query.typeUser = {$ne : 2}

	if($("#statusUser").val() != "T") data.query.statusUser = $("#statusUser").val()

	data.fn = "renderListUser"
	data.params = {
		view: "views/reports/listTeacher.jade",
		query: data.query
	}

	$.ajax({
		url: "/api/adminuser",
		type : "POST",
		contentType: "application/json",
		data : JSON.stringify(data),
		success: showReportResult
	})
})

$("#calendarActivities").submit(function (event) {
	event.preventDefault()
	var dateInit = new Date($("#dateInit").val().split()),
		dateEnd = new Date($("#dateEnd").val().split())
	$.ajax({
		url: "/api/activityhistory",
		type : "POST",
		contentType: "application/json",
		data : JSON.stringify({
			query:{date: {
				$gte: dateInit.toISOString(),
				$lte: dateEnd.toISOString()
			}
			},
			projection: {date:1}
		}),
		success: function(response){
			response.documents.forEach(document => {document.type = 1})
			$.ajax({
				url: "/api/activityvalid",
				type : "POST",
				contentType: "application/json",
				data : JSON.stringify({
					query:{date: {
						$gte: dateInit.toISOString(),
						$lte: dateEnd.toISOString()
					}
					},
					projection: {date:1}
				}),
				success: function(response2){
					response2.documents.forEach(document => {document.type = 10})
					//console.info(response.documents.concat(response2.documents))
					$("#showResultsReport")[0].scrollIntoView()
					drawCalendarActivities(response.documents.concat(response2.documents))
				}
			})
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
		success: showReportResult
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
		success: showReportResult
	})
})

$("#childrensToTeacherConsul").submit(function(event){
	event.preventDefault()

	$.ajax({ 
		url: "/reports/consult-teacher-activities",
		type : "POST",
		data : $(this).serialize(),
		success: function(response){
			if(!response.localsJade) return notification.show({msg:response.message,type:response.type})
			dataToChartChildrenToTeacher = response.localsJade.dataCustom
			showReportResult(response)
		}
	})
})


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

if(typeof dataTemplate != "undefined"){
	var dataGeneral = {}

	dataTemplate.histories.forEach(element => {
		if(!dataGeneral[element.idActivity.stepActivity]) dataGeneral[element.idActivity.stepActivity] = []
		dataGeneral[element.idActivity.stepActivity].push(element)
	})
}

$("#tableActivitiesValid tbody tr").click(function(){
	var step = $(this).data("ref-step"),
		activity = $(this).data("ref-activity")
	drawChartActivityHistory(step,activity)
})

function drawCalendarActivities(documents){
	window.documents = documents
	console.log(documents)
	var dataChart = documents.map(element => {return [new Date(element.date),element.type]})

	var dataTable = new google.visualization.DataTable()
	dataTable.addColumn({ type: "date", id: "Date" })
	dataTable.addColumn({ type: "number", id: "Date" })
	dataTable.addRows(dataChart)

	var chart = new google.visualization.Calendar(document.getElementById("showResultsReport"))

	var options = {
		title: "Calendario de Actividades",
		height: 350,
		calendar: {
			cellColor: {
				stroke: "#76a7fa",
				strokeOpacity: 0.5,
				strokeWidth: 1
			}
		},
		noDataPattern: {
			backgroundColor: "#76a7fa",
			color: "#a0c3ff"
		}
	}

	chart.draw(dataTable, options)
}

function drawChartStep(){

	var steps = dataTemplate.stepsValid
	var headerChart = [["Etapa", "Puntaje"]]
	var dataChart = steps.map(element => {return [element.idStep.nameStep,element.scoreStep]})

	if(!dataChart.length) return notification.show({msg:"No hay Datos Para la Graficas",type:CTE.STATUS_CODE.INFORMATION})

	
	dataChart = headerChart.concat(dataChart)

	var data = google.visualization.arrayToDataTable(dataChart)

	var options = {
		title: "Avance Por Etapas",
		chartArea: {width: "50%"},
		"fill-color":"black",
		hAxis: {
			title: "Puntaje",
			minValue: 0,
			viewWindow:{
				min:0,
				max:10
			}
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

	if(!data.length) return notification.show({msg:"No hay Datos Para la Graficas",type:CTE.STATUS_CODE.INFORMATION})

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
			},
			viewWindow:{
				min:0,
				max:10
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

function drawChartActivityHistory(step,activity){

	var headerChart = [["Fecha", "Puntaje Docente", "Puntaje Sistema"]]
	var dataStep = dataGeneral[step]

	var dataFilter = dataStep.filter(function(history){return history.idActivity.activityActivity == activity})

	var dataChart = dataFilter.map(function(history){
		var date = new Date(history.date)
		return [
			date.toLocaleString("es-CO",{hour12:true}),
			history.scoreTeachActivity,
			history.scoreSystemActivity
		]
	})

	if(!dataChart.length) return notification.show({msg:"No hay Datos Para la Graficas",type:CTE.STATUS_CODE.INFORMATION})

	dataChart = headerChart.concat(dataChart)

	var data = google.visualization.arrayToDataTable(dataChart)

	var options = {
		height:500,
		title: "Hitorial de Actividades",
		hAxis: {title: "Fecha",  titleTextStyle: {color: "#333"}, direction:-1,slantedText: true, slantedTextAngle: 90},
		vAxis: {title: "Puntaje", minValue: 0,viewWindow:{min:0,max:10}}
	}

	var chart = new google.visualization.AreaChart(document.getElementById("containerChart"))
	chart.draw(data, options)
}

function drawChartChildrenToTeacher(numberActivity) {
	var activityFind = dataToChartChildrenToTeacher.filter(activity => {return activity.some(dataActivity => {return dataActivity._id.idActivity.activityActivity == numberActivity})})

	var headerChart = [["Niñ@", "Puntaje Promedio"]]

	var dataChart = activityFind.map(dataActivity => {
		return dataActivity.map(datachildren => {
			var children = datachildren._id.idChildren
			var id = children.idChildren + " - " + children.nameChildren + " " + children.lastnameChildren
			return [id,datachildren.scoreAvgTeachActivity]
		})
	})[0]
	//console.info(dataChart)

	dataChart = headerChart.concat(dataChart)

	var data = google.visualization.arrayToDataTable(dataChart)

	var options = {
		height:200,
		title : "Niños Por Docente",
		vAxis: {title: "Puntaje Promedio",viewWindow:{min:0,max:10}},
		hAxis: {title: "Niñ@"},

		seriesType: "bars"
	}

	var chart = new google.visualization.ComboChart(document.getElementById("containerChart"))
	chart.draw(data, options)
}

function drawChartGlobalStepsValid() {

	var headerChart = [["Etapa", "Puntaje"]],
		dataChart = dataTemplate.stepsValid.map(stepValid => {return [stepValid.idStep.stepStep + " " + stepValid.idStep.nameStep,stepValid.scoreStep]})


	dataChart = headerChart.concat(dataChart)

	var data = google.visualization.arrayToDataTable(dataChart)

	var options = {
		title: "Estimulación",
		is3D:true,
		height:500
	}

	var chart = new google.visualization.PieChart(document.getElementById("containerChartGlobalStepsValid"))

	chart.draw(data, options)
}

$("#drawGlobalStepsValid").click(drawChartGlobalStepsValid)

