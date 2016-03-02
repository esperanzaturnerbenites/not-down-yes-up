	$.ajax({
		url: "/estimulation/add-children-activity",
		async : false, 
		type : "POST",
		data : ("#formAddChildAct").serializeArray(),
		success: function(childrens){
			if (childrens.nameChildren != null) {
				console.log(childrens.nameChildren)
				var clone = getClone("#consulQueryAddChild")
				var data = $(clone.querySelector("#showChildrens"))

				var lu = $("<lu>").attr({id:childrens.idChildren}).append(
					li = $("<li>",{html : childrens.nameChildren })
				)
				data.append(lu)
				renderResults(clone)
			}
	    }
	})





formAddChildAct.on("submit",(event) => {
	event.preventDefault()
	data = $("#formAddChildAct :input").map( function(e){if ($(this).val()) return this})

	$.ajax({
		url: "/estimulation/add-children-activity",
		async : false, 
		type : "POST",
		data : data.serializeArray(),
		success: function(childrens){
			if (childrens.nameChildren != null) {
				console.log(childrens.nameChildren)
				var clone = getClone("#consulQueryAddChild")
				var data = $(clone.querySelector("#showChildrens"))

				var button = $("<button>").attr({id:"0"}).append(
					span = $("<span>",{html : childrens.nameChildren })
				)
				data.append(button)
				renderResults(clone)
			}
	    }
	})
})











router.post("/add-children-activity",(req,res)=>{
	var data = req.body,
		childrensSend = []
		isEmpty = true,
		ids = []

	console.log(data)

	for(childrenData in data){
		console.log("for inicia " + data[childrenData])
		models.children.findOne({idChildren : data[childrenData]}, (err,children) => {
			console.log("models " + children)
	  		if (err) res.send(err)
	  		else if(!children){
	  			console.log("if !children " + data[childrenData])
	  			isEmpty = false
	  			ids.push(data[childrenData])
	  		}else{
	  			childrensSend.push(children)
	  			console.log("else !children " + children)
	  		}
		})
	}
	if (isEmpty) res.json({childrensSend:childrensSend})
	else res.json({"msg":"Children not found",ids:ids})
})