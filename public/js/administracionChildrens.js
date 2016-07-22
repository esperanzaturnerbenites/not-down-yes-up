$("#formOpeChildrenInfo").click(function(event){ 
	window.open("/reports/info-children/" + $("#adminInfoChildren").val())
})

$("#formOpeChildrenUpd").click(function(event){
	window.open("/admin/register-children/" + $("#adminInfoChildren").val())
}) 

$("#formOpeStatusChildren").submit(function(event){
	event.preventDefault()
	if(confirm("Se cambiará el estado del niñ@ " + $("#adminUpdChildren").val() + ". ¿Desea continuar?")){
		var statusEstimulation = ""
		if($("#statusChildren").val() == 0){
			statusEstimulation = 3
		}else if($("#statusChildren").val() == 1){
			statusEstimulation = 0
		}
		$.ajax({
			url: "/api/children",
			contentType : "application/json", 
			data : JSON.stringify({
				data:{
					$set: {
						statusChildren:$("#statusChildren").val(),
						statusChildrenEstimulation:statusEstimulation
					},
					$push: {
						observationChildren: {
							observation: $("#observationChildren").val(),
							status: $("#statusChildren").val()
						}
					}
				},
				query:{
					idChildren:$("#adminUpdChildren").val()
				}
				//fn: "addObservationChildren",
				//params :{idChildren:$("#adminUpdChildren").val()}
			}),
			type : "PUT",
			success: function(response){
				notification.show({msg:response.msg, type:response.statusCode})
			}
		})
	}
})

//Revisar valid step
$("#formOpeValidChildren").submit(function(event){
	event.preventDefault()
	$.ajax({
		url: "/admin/show-valid-step",
		async : false, 
		type : "POST",
		data : $(this).serializeArray(),
		success: function(result){
			if(result.err) return notification.show({msg:result.err.message, type:1})
			notification.show({msg:result.msg, type:result.statusCode})

			if(result){
				var clone = getClone("#consulQueryChildrenValid"),
					data = $(clone.querySelector("#dataNameChild")),
					activities = result.activitiesvalid
				if(activities){
					if(activities.length >= 2){
						clone.querySelector("#nameChildren").innerHTML = "Niñ@: " + result.children.nameChildren + " " + result.children.lastnameChildren
						clone.querySelector("#step").innerHTML = "Etapa: " + result.step.stepStep
						//clone.querySelector("#step").innerHTML = "Etapa: " + result.step.stepStep

						var num = 0,
							scoreS = 0

						for (var activity of activities){
							num++
							scoreS += activity.scoreTeachActivity
							var a = $("<article>").append(
									h3 = $("<h2>",{html : "ACTIVIDAD " + num + ": " + activity.idActivity.nameActivity})),
								a2 = $("<article>").append(
									label = $("<label>",{html : "Estado: " }),
									input = $("<input>")
									.prop("type", "text")
									.attr({id:"actStatus" + num})
									.prop("readonly", true)
									.prop("name", "actStatus" + num)
									.val(funcStatusAct(activity.statusActivity))),
								a3 = $("<article>").append(
									label = $("<label>",{html : "Puntaje: " }),
									input = $("<input>")
									.prop("type", "number")
									.attr({id:"actScore" + num})
									.prop("readonly", true)
									.prop("name", "actScore" + num)
									.val(activity.scoreTeachActivity))
							data.append(a, a2, a3)
						}

						var scoreStepValid = scoreS/num
						clone.querySelector("#scoreStep").value = scoreStepValid

						if(scoreStepValid >= 6){
							clone.querySelector("#statusStep").value = "Completada"
						}else{
							clone.querySelector("#statusStep").value = "No Completada"
						}

						$("#idChildren").prop("readonly", true)

						$("#cancelValidStep",clone).click(()=>{
							$("#formValidChildren").remove()
							$("#idChildren").val("")
							$("#idChildren").prop("readonly", false)
						})

						var idStep = result.step._id,
							idChildren = result.children.idChildren,
							statStep = 0

						if($("#statusStep").val() == "No Completada")
							statStep = 0
						else if($("#statusStep").val() == "Completada")
							statStep = 1

						$("#formValidStepChildren").on("submit",(event)=>{
							event.preventDefault()
							if(activities.length == 2){
								$.ajax({
									url: "/admin/valid-step",
									async : false, 
									type : "POST",
									data : {observationStep : $("#observationStep").val(),
											scoreStep : $("#scoreStep").val(),
											idStep : idStep,
											idChildren : idChildren,
											statusStep :  statStep},
									success: function(result){
										if(result.err) return notification.show({msg:result.err.message, type:1})
										$("#formValidStepChildren").remove()
										$("#idChildren").val("")
										$("#idChildren").prop("readonly", false)
										notification.show({msg:result.msg, type:result.statusCode})
									}
								})
							}
						})
						console.log(clone)
						renderResultValidAdmin(clone)
					}else notification.show({msg:"¡No cumple con las condiciones necesarias para ser validad@!", type:2})
				}
			}
		}
	})
})