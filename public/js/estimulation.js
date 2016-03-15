const formAddChildAct = $("#formAddChildAct"),
	formValidChildren = $("#formValidChildren")

var showChildrensCont = $("#showChildrensCont"),
	activityChildrens = $("#activityChildrens"),
	showValidAct = $("#showValidAct"),
	results = $("#results")

function getClone(selector){
	var t = document.querySelector(selector)
	clone = document.importNode(t.content,true)
	return clone
}

function renderResults(node){showChildrensCont.html(""); showChildrensCont.append(node)}
function renderResultAct(node){activityChildrens.html(""); activityChildrens.append(node)}
function renderResultValid(node){showValidAct.html(""); showValidAct.append(node)}
function renderResultDataResult(node){results.html(""); results.append(node)}
function renderResultDataStep(node){resultStep.html(""); resultStep.append(node)}

formAddChildAct.on("submit",(event) => {
	event.preventDefault()

	$.ajax({
		url: "/estimulation/found-children",
		async : false, 
		data : $("#formAddChildAct").serialize(),
		type : "POST",
		success: function(childrens){
			if(childrens.nameChildren != null) {
				console.log(childrens.nameChildren)
				var clone = getClone("#consulQueryAddChild"),
					cloneAct = getClone("#consulQueryActivityChild")
				var data = $(clone.querySelector("#showChildrens")),
					dataAct = $(clone.querySelector("#activityChildrens"))

				var pName = $("<p>").attr({id:childrens.idChildren}).append(
					span = $("<span>",{html : "Identificación: " + childrens.idChildren})
				),
				pId = $("<p>").attr({id:childrens.idChildren}).append(
					span = $("<span>",{html : childrens.nameChildren + " " + childrens.lastnameChildren})
				),
				button = $("<button>")
					.attr("id","infoChildren")
					.attr("type","button")
					.click(() => {
						window.open("/estimulation/infoChildren/" + $("#idChildren").val())
					})
					.append($("<span>", {html : "Info: " + childrens.nameChildren})
				)
				data.append(pName)
				data.append(pId)
				data.append(button)

				$("#cancelAddChildren",clone).click(()=>{
					$("#formValidChildren").remove()
					$("#formInicAct").remove()
					$("#nameChild").remove()
					$("#nameChild1").remove()
					$("#nameChild2").remove()
					$("#idChildren").prop("readonly", false)
					$("#idChildren").val("")
					$("#validActClicDef").prop("disabled", true)
				})
				renderResults(clone)
				renderResultAct(cloneAct)

				$("#idChildren").prop("readonly", true)
				$("#validActClicDef").prop("disabled", false)

			}
		}
	})
})

$("#validActClicDef").on("click",(event) => {
	event.preventDefault()

	$.ajax({
		url: "/estimulation/found-children",
		async : false, 
		data : $("#formAddChildAct").serialize(),
		type : "POST",
		success: function(result){
			var clone = getClone("#consulQueryChildrenValid")

			var data = $(clone.querySelector("#dataNameChild"))

			var label = $("<label>",{html : "Identificación Niñ@: "})
			input = $("<input>",{html : result.idChildren})
				.prop("type", "number")
				.attr({id:"idChildren"})
				.prop("readonly", true)
				.prop("name", "idChildren")
				.val(result.idChildren)
			
			$("#buttonCancelValidAct",clone).click(()=>{
				$("#formValidChildren").remove()
			})
			
			$("#buttonValidAct",clone).click(()=>{
				$.ajax({
					url: "/estimulation/valid-activity-complete",
					async : false, 
					data : {actGeneral : ($("#formValidChildren")).serialize(), 
							stepActivity : $("#numberStep").val(),
							activityActivity : $("#numberActivity").val()},
					type : "POST",
					success: function(activity){
						console.log(activity)
					}
				})
				$("#formInicAct").remove()
				$("#nameChild").remove()
				$("#nameChild1").remove()
				$("#nameChild2").remove()
				$("#formValidChildren").remove()
				$("#idChildren").val("")
				$("#idChildren").prop("readonly", false)
				$("#validActClicDef").prop("disabled", true)
			})

			data.append(label)
			data.append(input)
			renderResultValid(clone)
		}
	})
})

$("#restarActClic").click(()=>{
	$("#formInicAct").remove()
	$("#nameChild").remove()
	$("#nameChild1").remove()
	$("#nameChild2").remove()
	$("#formValidChildren").remove()
	$("#idChildren").val("")
	$("#idChildren").prop("readonly", false)
	$("#validActClicDef").prop("disabled", true)
})

$("#continueViewMore").click((event) => {
	var clone = getClone("#consulQueryDataChild")
	renderResultDataResult(clone)
})

$("#continueStepAll").click((event) => {
	var clone = getClone("#consulQueryDataActOne")
	renderResultDataResult(clone)
})

$("#continueActAll").click((event) => {
	var clone = getClone("#consulQueryDataActAll")
	renderResultDataResult(clone)
})

$("#consulStep1").click((event) => {
	var clone = getClone("#consulQueryDataStepDetail")
	renderResultDataStep(clone)
})