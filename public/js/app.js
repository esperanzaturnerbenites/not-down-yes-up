//Definir constante que captura un elemento html
const formAddChildren = $("#formAddChildren"),
formAuthenticateUser = $("#formAuthenticateUser")

	

formAuthenticateUser.on("submit", (event) => {
	event.preventDefault()
	$.ajax({
		url: "/users/authenticate",
		async : false, 
		data : formAuthenticateUser.serialize(),
		type : "POST",
		success: function(result){
        console.log(result);
	    }
	});
})

//Asigna un escuchador de evento --- Cuando suceda el evento
formAddChildren.on("submit",(event) => {
	event.preventDefault()
	$.ajax({
		url: "/admin/register-children",
		async : false, 
		data : {children : $(".children").serialize(),
			mom : $(".mom").serialize(),
			dad : $(".dad").serialize(),
			care : $(".care").serialize()},
		type : "POST",
		success: function(result){
        console.log(result);
	    }
	});
})

