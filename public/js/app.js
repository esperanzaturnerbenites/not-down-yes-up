//Definir constante que captura un elemento html
const formAddChildren = $("#formAddChildren"),
formAddUser = $("#formAddUser"),
formUpdatePass = $("#formUpdatePass")
formOpeChildren = $("#formOpeChildren")

//Asigna un escuchador de evento --- Cuando suceda el evento
formAddChildren.on("submit",(event) => {
	event.preventDefault()
	$.ajax({
		url: "/admin/register-children",
		async : false, 
		data : {children : $(".children").serialize(), //Como concatenar otros datos Status, DateStart, Date End
			mom : $(".mom").serialize(),
			dad : $(".dad").serialize(),
			care : $(".care").serialize()},
		type : "POST",
		success: function(result){
        console.log(result);
	    }
	});
})

//Asigna un escuchador de evento --- Cuando suceda el evento
formAddUser.on("submit",(event) => {
	event.preventDefault()
	$.ajax({
		url: "/admin/register-user",
		async : false, 
		data : {userAdd : $(".userAdd").serialize(),
			userAdmin : $(".userAdmin").serialize()},
		type : "POST",
		success: function(result){
        console.log(result);
	    }
	});
})

formUpdatePass.on("submit",(event) => {
	event.preventDefault()
	$.ajax({
		url: "/admin/update-pass",
		async : false, 
		data : $("#formUpdatePass").serialize(),
		type : "POST",
		success: function(result){
        console.log(result);
	    }
	});
})

formOpeChildren.on("submit.formOpeChildrenDel",(event) => {
	event.preventDefault()
	$.ajax({
		url: "/admin/delete-childrens",
		async : false, 
		data : $("#formOpeChildren").serialize(),
		type : "POST",
		success: function(result){
        console.log(result);
	    }
	});
})