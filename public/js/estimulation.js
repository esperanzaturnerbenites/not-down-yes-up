const formAddChildAct = $("#formAddChildAct"),
	formValidChildren = $("#formValidChildren")

var showChildrensCont = $("#showChildrensCont"),
	activityChildrens = $("#activityChildrens"),
	showValidAct = $("#showValidAct")

function getClone(selector){
	var t = document.querySelector(selector)
	clone = document.importNode(t.content,true)
	return clone
}

function renderResults(node){showChildrensCont.html(""); showChildrensCont.append(node)}
function renderResultAct(node){activityChildrens.html(""); activityChildrens.append(node)}
function renderResultValid(node){showValidAct.html(""); showValidAct.append(node)}

formAddChildAct.on("submit",(event) => {
	event.preventDefault()

	$.ajax({
		url: "/estimulation/found-children",
		async : false, 
		data : $("#formAddChildAct").serialize(),
		type : "POST",
		success: function(childrens){
			if (childrens.nameChildren != null) {
				console.log(childrens.nameChildren)
				var clone = getClone("#consulQueryAddChild"),
					cloneAct = getClone("#consulQueryActivityChild")
				var data = $(clone.querySelector("#showChildrens")),
					dataAct = $(clone.querySelector("#activityChildrens"))

				var pName = $("<p>").attr({id:childrens.idChildren}).append(
					span = $("<span>",{html : "Identificación: " + childrens.idChildren})
				)
				var pId = $("<p>").attr({id:childrens.idChildren}).append(
					span = $("<span>",{html : childrens.nameChildren + " " + childrens.lastnameChildren})
				)
				data.append(pName)
				data.append(pId)

				$("#cancelAddChildren",clone).click(()=>{
					$("#formValidChildren").remove()
					$("#formInicAct").remove()
					$("#nameChild").remove()
					$("#nameChild1").remove()
					$("#nameChild2").remove()
					$("#idChildren").prop("readonly", false)
					$("#idChildren").val("")
					$("#validActClic").prop("disabled", true)
				})

				renderResults(clone)
				renderResultAct(cloneAct)

				$("#idChildren").prop("readonly", true)
				$("#validActClic").prop("disabled", false)

			}
		}
	})
})

$("#validActClic").on("click",(event) => {
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
						step : $("#step").serialize(),
						activity : $("#activity").serialize()},
					type : "POST",
					success: function(activity){
						console.log(activity)
					}
				})
			})

			data.append(label)
			data.append(input)
			renderResultValid(clone)
		}
	})
})
