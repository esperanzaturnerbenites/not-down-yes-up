var showResultsReport = $("#showResultsReport")

function getClone(selector){
	var t = document.querySelector(selector)
	//var t = document.querySelector("#consulQueryGeneralAvanced")
	return clone = document.importNode(t.content,true)
}

function renderResultsReport(node){ showResultsReport.html(""); showResultsReport.append(node)}

function genderChild(gender){
	var genderText = ""
	if(gender == 0)
		genderText = "Niña"
	if(gender == 1)
		genderText = "Niño"
	return genderText
}

$("#consulG").change(() => {
	$.ajax({
		url: "/reports/general",
		async : false, 
		type : "POST",
		success: function(result){
			var childrens = result.childrens,
				steps = result.steps

			if($("#consulG").val() == 0){
				var clone = getClone("#consulQueryGeneralAvanced"),
					data = $(clone.querySelector("#data"))

				for(children of childrens){
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

			}else if($("#consulG").val() == 1){
				var clone = getClone("#consulQueryAgeStep"),
				dataAgeStep = $(clone.querySelector("#dataAgeStep"))

				for(step of steps){
					//Preguntar etpas 1, 2, 3 o 4
					var tr = $("<tr>").append(
						$("<td>", {html : step.idChildren.nameChildren})
					)
					dataAgeStep.append(tr)
				}
				renderResultsReport(clone)

			}else if($("#consulG").val() == 2){
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

$("#buttonConsulIdChildren").click((event) => {
	event.preventDefault()

	$.ajax({
		url: "/reports/children",
		async : false, 
		data : $("#consulChildren").serialize(),
		type : "POST",
		success: function(result){
			var children = result.children,
				mom = result.mom,
				dad = result.dad,
				care = result.care,
				activities = result.activities

			function telChildren(liveson){
				if (liveson == 0) return mom.telMom
				if (liveson == 1) return mom.telMom
				if (liveson == 2) return dad.telDad
				if (liveson == 3) return care.telCare
			}

			var clone = getClone("#consulQueryChildren"),
				dataChild1 = $(clone.querySelector("#dataChild1"))
				dataChild2 = $(clone.querySelector("#dataChild2"))

			var p1 = $("<p>").append(
					$("<b>", {html : "Nombre: "}),
					$("<span>", {html : children.nameChildren + " " + children.lastnameChildren})),
				p2 = $("<p>").append(
					$("<b>", {html : "N° Identificación: "}),
					$("<span>", {html : children.idChildren })),
				p3 = $("<p>").append(
					$("<b>", {html : "Género: "}),
					$("<span>", {html : genderChild(children.genderChildren)})),
				p4 = $("<p>").append(
					$("<b>", {html : "Nacimiento: "}),
					$("<span>", {html : children.birthdateChildren})),
				p5 = $("<p>").append(
					$("<b>", {html : "Mamá: "}),
					$("<span>", {html : mom.nameMom + " " + mom.lastnameMom})),
				p6 = $("<p>").append(
					$("<b>", {html : "Papá: "}),
					$("<span>", {html : dad.nameDad + " " + dad.lastnameDad})),
				p7 = $("<p>").append(
					$("<b>", {html : "Cuidador: "}),
					$("<span>", {html : care.nameCare + " " + care.lastnameCare})),
				p8 = $("<p>").append(
					$("<b>", {html : "Dirección: "}),
					$("<span>", {html : children.addressChildren})),
				p9 = $("<p>").append(
					$("<b>", {html : "Teléfono: "}),
					$("<span>", {html : telChildren(children.liveSon)})),
				p10 = $("<p>").append(
					$("<b>", {html : "Fecha de Ingreso: "}),
					$("<span>", {html : children.dateStart})),
				p11 = $("<p>").append(
					$("<b>", {html : "Estado Actual: "}),
					$("<span>", {html : children.statusChildren}))

				dataChild1.append(p1, p2, p3, p4, p5, p6, p7, p8, p9)
				dataChild2.append(p10, p11)

			renderResultsReport(clone)
		}
	})
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