var showResult = $("#showResult")

function getClone(selector){
	var t = document.querySelector(selector)
	//var t = document.querySelector("#consulQueryGeneralAvanced")
	return clone = document.importNode(t.content,true)
}

function renderResults(node){ showResult.html(""); showResult.append(node)}

$("#consulG").change(() => {
	$.ajax({
		url: "/reports/general",
		async : false, 
		type : "POST",
		success: function(childrens){
			var clone = getClone("#consulQueryGeneralAvanced")
			var data = $(clone.querySelector("#data"))

			for (children of childrens){
				var tr = $("<tr>").append(
					$("<td>",{html : children.nameChildren + children.lastnameChildren }),
					$("<td>",{html : children.ageChildren })
				)
				data.append(tr)
			}
			renderResults(clone)
	    }
	})
})

$("#consulChildren").submit(() => {

})
$("#consulAvanced").submit(() => {

})