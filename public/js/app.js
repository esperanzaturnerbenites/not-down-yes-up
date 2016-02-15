//Definir constante que captura un elemento html
const formAddChildren = $("#formAddChildren"),
formAddUser = $("#formAddUser"),
formValidUser = $("#formValidUser"),
formUpdatePass = $("#formUpdatePass"),
formOpeChildren = $("#formOpeChildren"),
formOpeUser = $("#formOpeUser"),
formOpeTeachAdmin = $("#formOpeTeachAdmin"),
formNewUser = $("#formNewUser")


//Asigna un escuchador de evento --- Cuando suceda el evento
formAddChildren.on("submit",(event) => {
	event.preventDefault()
	$.ajax({
		url: "/admin/register-children",
		async : false, 
		data : {children : ($(".children")).serialize(), //Como concatenar otros datos Status, DateStart, Date End
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
function addUser(){

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
}
//Asigna un escuchador de evento --- Cuando suceda el evento
formValidUser.on("submit",(event) => {
	event.preventDefault()
	$.ajax({
		url: "/admin/valid-user",
		async : false, 
		data : $("#formValidUser").serialize(),
		type : "POST",
		success: function(result){
			console.log(typeof result)
			console.log(result)
       		if (result.valid) {
       			$("#formAddUser")
       			.removeClass("hide")
       			.on("submit",addUser)
       		}else{
				$("#formAddUser")
				.addClass("hide")
				.off("submit",addUser)
       	}

	    }
	});
})

formNewUser.on("submit",(event) => {
	event.preventDefault()
	$.ajax({
		url: "/admin/register-newuser",
		async : false, 
		data : $("#formNewUser").serialize(),
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

formOpeUser.on("submit.formOpeUserDel",(event) => {
	event.preventDefault()
	$.ajax({
		url: "/admin/delete-users",
		async : false, 
		data : $("#formOpeUser").serialize(),
		type : "POST",
		success: function(result){
        console.log(result);
	    }
	});
})

formOpeTeachAdmin.on("submit.formOpeTeachAdminDel",(event) => {
	event.preventDefault()
	$.ajax({
		url: "/admin/delete-teachadmin",
		async : false, 
		data : $("#formOpeTeachAdmin").serialize(),
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