$("#formOpeChildrenInfo").click(function(event){
	if(!$("#adminInfoChildren"))
		window.open("/reports/info-children/" + $("#adminInfoChildren").val())
})

$("#formOpeChildrenUpd").click(function(event){
	if(!$("#adminInfoChildren"))
		window.open("/admin/register-children/" + $("#adminInfoChildren").val())
}) 

$("#formOpeChildren").submit(function(event){event.preventDefault()})

$("#formOpeStatusChildren").submit(function(event){
	event.preventDefault()
	if(confirm("Se cambiará el estado del niñ@ " + $("#adminUpdChildren").val() + ". ¿Desea continuar?")){
		$.ajax({
			url: "/api/children",
			contentType : "application/json", 
			data : JSON.stringify({
				data:{
					$set: {statusChildren:$("#statusChildren").val()},
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
				notification.show({msg:response.message, type:response.statusCode})
			}
		})
	}
})

function validStep(event){
	event.preventDefault()
	$.ajax({
		url: "/admin/valid-step",
		type : "POST",
		data : $(this).serialize(),
		success: function(response){
			$("#showResultValid").empty()
			$("#formValidStep").addClass("hide")
			$("#formValidStep").off("submit",validStep)
			notification.show({msg:response.message, type:response.statusCode})
		}
	})
}

//Revisar valid step
$("#formPreValidStep").submit(event => {
	event.preventDefault()
	$.ajax({
		url: "/admin/pre-valid-step",
		type : "POST",
		data : {step:$("#step").val(),idChildren:$("#idChildren").val()},
		success: function(response){
			$("#showResultValid").html(response.html)
			$("#formValidStep").removeClass("hide")
			$("#formValidStep #idChildren").val($("#idChildren").val())
			$("#formValidStep #stepStep").val($("#step","#formPreValidStep").val())
			
			$("#formValidStep").submit(validStep)
		}
	})
})